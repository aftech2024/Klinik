import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MedicalRecordsService {
  constructor(private prisma: PrismaService) {}

  async findByPatient(patientId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.medicalRecord.findMany({
        where: { patientId },
        include: {
          doctor: { select: { name: true, specialty: true } },
          appointment: { select: { appointmentDate: true, appointmentTime: true, service: { select: { name: true } } } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.medicalRecord.count({ where: { patientId } }),
    ]);
    return { data, total, page, limit };
  }

  async findById(id: string) {
    const record = await this.prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        patient: { select: { id: true, name: true, medicalNumber: true } },
        doctor: { select: { id: true, name: true, specialty: true } },
        appointment: { select: { appointmentDate: true, appointmentTime: true } },
      },
    });
    if (!record) throw new NotFoundException('Rekam medis tidak ditemukan');
    return record;
  }

  async create(dto: {
    appointmentId: string;
    patientId?: string;
    doctorId?: string;
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    vitalSigns?: any;
    diagnosis?: any;
    prescriptions?: any;
    notes?: string;
  }) {
    // Auto-resolve patientId & doctorId from appointment if not provided
    let patientId = dto.patientId;
    let doctorId = dto.doctorId;

    if (!patientId || !doctorId) {
      const appt = await this.prisma.appointment.findUnique({
        where: { id: dto.appointmentId },
        select: { patientId: true, doctorId: true },
      });
      if (!appt) throw new BadRequestException('Appointment tidak ditemukan');
      patientId = patientId ?? appt.patientId;
      doctorId = doctorId ?? appt.doctorId;
    }

    return this.prisma.medicalRecord.create({
      data: {
        appointmentId: dto.appointmentId,
        patientId,
        doctorId,
        subjective: dto.subjective,
        objective: dto.objective,
        assessment: dto.assessment,
        plan: dto.plan,
        vitalSigns: dto.vitalSigns ?? undefined,
        diagnosis: dto.diagnosis ?? undefined,
        prescriptions: dto.prescriptions ?? undefined,
        notes: dto.notes,
      },
      include: {
        patient: { select: { id: true, name: true, medicalNumber: true } },
        doctor: { select: { id: true, name: true, specialty: true } },
        appointment: { select: { appointmentDate: true, appointmentTime: true } },
      },
    });
  }

  async update(id: string, dto: {
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    vitalSigns?: any;
    diagnosis?: any;
    prescriptions?: any;
    notes?: string;
  }) {
    return this.prisma.medicalRecord.update({
      where: { id },
      data: {
        ...dto,
        vitalSigns: dto.vitalSigns ?? undefined,
        diagnosis: dto.diagnosis ?? undefined,
        prescriptions: dto.prescriptions ?? undefined,
      },
    });
  }

  async addPrescription(id: string, dto: { medicineId: string; name: string; dosage: string; quantity: number; notes?: string }) {
    const record = await this.prisma.medicalRecord.findUnique({ where: { id }, select: { prescriptions: true } });
    if (!record) throw new NotFoundException('Rekam medis tidak ditemukan');

    const prescriptions = (record.prescriptions as any[]) ?? [];
    prescriptions.push({
      id: `rx-${Date.now()}`,
      medicineId: dto.medicineId,
      name: dto.name,
      dosage: dto.dosage,
      quantity: dto.quantity,
      notes: dto.notes ?? null,
      prescribedAt: new Date().toISOString(),
    });

    return this.prisma.medicalRecord.update({
      where: { id },
      data: { prescriptions },
    });
  }

  async removePrescription(id: string, index: number) {
    const record = await this.prisma.medicalRecord.findUnique({ where: { id }, select: { prescriptions: true } });
    if (!record) throw new NotFoundException('Rekam medis tidak ditemukan');

    const prescriptions = (record.prescriptions as any[]) ?? [];
    if (index < 0 || index >= prescriptions.length) {
      throw new BadRequestException('Indeks resep tidak valid');
    }
    prescriptions.splice(index, 1);

    return this.prisma.medicalRecord.update({
      where: { id },
      data: { prescriptions },
    });
  }
}
