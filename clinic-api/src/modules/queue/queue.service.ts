import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QueueService {
  constructor(private prisma: PrismaService) {}

  async getByBranch(branchId: string, date?: string) {
    const queueDate = date ? new Date(date) : new Date();
    queueDate.setHours(0, 0, 0, 0);

    return this.prisma.queue.findMany({
      where: {
        appointment: { branchId, appointmentDate: queueDate },
        status: { in: ['WAITING', 'CALLED', 'IN_PROGRESS'] },
      },
      include: {
        appointment: {
          include: {
            patient: { select: { name: true, medicalNumber: true } },
            doctor: { select: { name: true, specialty: true } },
            service: { select: { name: true } },
          },
        },
      },
      orderBy: { queueNumber: 'asc' },
    });
  }

  async callNext(branchId: string, doctorId?: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const next = await this.prisma.queue.findFirst({
      where: {
        status: 'WAITING',
        appointment: {
          branchId,
          appointmentDate: today,
          ...(doctorId && { doctorId }),
        },
      },
      orderBy: { queueNumber: 'asc' },
    });

    if (!next) throw new NotFoundException('Tidak ada antrian berikutnya');

    return this.prisma.queue.update({
      where: { id: next.id },
      data: { status: 'CALLED', calledAt: new Date() },
    });
  }

  async updateStatus(queueId: string, status: string) {
    return this.prisma.queue.update({
      where: { id: queueId },
      data: { status: status as 'WAITING' | 'CALLED' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' },
    });
  }

  async getMyQueue(userId: string) {
    const patient = await this.prisma.patient.findUnique({ where: { userId } });
    if (!patient) return [];
    return this.prisma.queue.findMany({
      where: { appointment: { patientId: patient.id } },
      include: {
        appointment: {
          select: {
            id: true,
            appointmentNo: true,
            appointmentDate: true,
            appointmentTime: true,
            doctor: { select: { name: true, specialty: true } },
            branch: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats(branchId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [waiting, inProgress, completed] = await Promise.all([
      this.prisma.queue.count({
        where: { status: 'WAITING', appointment: { branchId, appointmentDate: today } },
      }),
      this.prisma.queue.count({
        where: { status: { in: ['CALLED', 'IN_PROGRESS'] }, appointment: { branchId, appointmentDate: today } },
      }),
      this.prisma.queue.count({
        where: { status: 'COMPLETED', appointment: { branchId, appointmentDate: today } },
      }),
    ]);

    return { waiting, inProgress, completed, total: waiting + inProgress + completed };
  }
}
