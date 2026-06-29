import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  private async resolvePatientId(userId: string): Promise<string> {
    let patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) {
      const medicalNumber = `MRN-${Date.now().toString(36).toUpperCase()}`;
      patient = await this.prisma.patient.create({
        data: { userId, name: 'Pasien', medicalNumber },
      });
    }
    return patient.id;
  }

  async create(data: {
    userId?: string;
    patientId?: string;
    doctorId: string;
    branchId: string;
    serviceId?: string;
    appointmentDate?: string;
    appointmentTime?: string;
    scheduledAt?: string;
    notes?: string;
  }) {
    const patientId = data.patientId ?? (data.userId ? await this.resolvePatientId(data.userId) : null);
    if (!patientId) throw new BadRequestException('patientId or userId required');

    let appointmentDate: Date;
    let appointmentTime: string;
    if (data.scheduledAt) {
      const d = new Date(data.scheduledAt);
      appointmentDate = d;
      appointmentTime = d.toTimeString().slice(0, 5);
    } else {
      appointmentDate = new Date(data.appointmentDate!);
      appointmentTime = data.appointmentTime!;
    }

    const appointmentNo = `APT-${Date.now().toString(36).toUpperCase()}`;

    const appointment = await this.prisma.appointment.create({
      data: {
        appointmentNo,
        patientId,
        doctorId: data.doctorId,
        branchId: data.branchId,
        serviceId: data.serviceId,
        appointmentDate,
        appointmentTime,
        notes: data.notes,
        status: 'PENDING',
      },
      include: {
        doctor: { select: { name: true, specialty: true } },
        branch: { select: { name: true, address: true } },
        service: { select: { name: true } },
      },
    });

    // Auto-generate queue number for that branch + date
    const dayStart = new Date(appointmentDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const sameDayCount = await this.prisma.queue.count({
      where: {
        branchId: data.branchId,
        appointment: { appointmentDate: { gte: dayStart, lt: dayEnd } },
      },
    });

    const queue = await this.prisma.queue.create({
      data: {
        appointmentId: appointment.id,
        branchId: data.branchId,
        queueNumber: sameDayCount + 1,
        status: 'WAITING',
      },
    });

    return { ...appointment, queue };
  }

  async findByPatient(userId: string) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) return [];
    return this.prisma.appointment.findMany({
      where: { patientId: patient.id },
      include: {
        doctor: { select: { name: true, specialty: true, photoUrl: true } },
        branch: { select: { name: true } },
        service: { select: { name: true } },
      },
      orderBy: { appointmentDate: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { select: { id: true, name: true, medicalNumber: true, dateOfBirth: true, gender: true, user: { select: { phone: true } } } },
        doctor: { select: { id: true, name: true, specialty: true } },
        branch: { select: { id: true, name: true, address: true, city: true } },
        service: { select: { id: true, name: true } },
        queue: true,
        medicalRecord: { select: { id: true } },
      },
    });
  }

  async findAll(query?: { branchId?: string; status?: string; date?: string }) {
    return this.prisma.appointment.findMany({
      where: {
        ...(query?.branchId && { branchId: query.branchId }),
        ...(query?.status && { status: query.status as any }),
        ...(query?.date && { appointmentDate: new Date(query.date) }),
      },
      include: {
        patient: { select: { id: true, name: true, medicalNumber: true } },
        doctor: { select: { id: true, name: true, specialty: true } },
        branch: { select: { id: true, name: true, city: true } },
        service: { select: { id: true, name: true } },
        queue: true,
        medicalRecord: { select: { id: true } },
      },
      orderBy: { appointmentDate: 'desc' },
    });
  }

  async updateStatus(id: string, status: string, cancelReason?: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: status as any, cancelReason },
    });
  }
}
