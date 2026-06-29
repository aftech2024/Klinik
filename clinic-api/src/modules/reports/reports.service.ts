import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  // branchId set → scope all KPIs to that clinic (Admin Klinik). Null → global (Super Admin).
  async getDashboardKpi(branchId?: string | null) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const apptBranch = branchId ? { branchId } : {};

    const [totalDoctors, appointmentsToday, appointmentsMonth, revenue, patientGroups] = await Promise.all([
      branchId
        ? this.prisma.doctor.count({ where: { isActive: true, branches: { some: { branchId } } } })
        : this.prisma.doctor.count({ where: { isActive: true } }),
      this.prisma.appointment.count({ where: { appointmentDate: today, ...apptBranch } }),
      this.prisma.appointment.count({ where: { appointmentDate: { gte: thisMonth }, ...apptBranch } }),
      this.prisma.billing.aggregate({
        where: {
          status: 'PAID',
          createdAt: { gte: thisMonth },
          ...(branchId && { appointment: { branchId } }),
        },
        _sum: { totalAmount: true },
      }),
      // Distinct patients — for a clinic, only those with an appointment there
      branchId
        ? this.prisma.appointment.findMany({
            where: { branchId },
            distinct: ['patientId'],
            select: { patientId: true },
          })
        : null,
    ]);

    const totalPatients = branchId
      ? (patientGroups?.length ?? 0)
      : await this.prisma.patient.count();

    return {
      totalPatients,
      totalDoctors,
      appointmentsToday,
      appointmentsMonth,
      revenueMonth: Number(revenue._sum?.totalAmount ?? 0),
    };
  }

  async getAppointmentStats(from: string, to: string, branchId?: string) {
    return this.prisma.appointment.groupBy({
      by: ['status'],
      where: {
        appointmentDate: { gte: new Date(from), lte: new Date(to) },
        ...(branchId && { branchId }),
      },
      _count: { id: true },
    });
  }

  async getRevenueSummary(from: string, to: string) {
    const result = await this.prisma.billing.aggregate({
      where: { status: 'PAID', createdAt: { gte: new Date(from), lte: new Date(to) } },
      _sum: { totalAmount: true },
      _count: { id: true },
    });
    return { total: Number(result._sum?.totalAmount ?? 0), count: result._count.id };
  }

  async getTopDoctors(limit = 5) {
    return this.prisma.appointment.groupBy({
      by: ['doctorId'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });
  }
}
