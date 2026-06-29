import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { status?: string; patientId?: string; page?: number; limit?: number }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 20;
    const [data, total] = await Promise.all([
      this.prisma.billing.findMany({
        where: {
          ...(query?.status && { status: query.status as 'DRAFT' | 'PENDING' | 'PAID' | 'PARTIAL' | 'CANCELLED' | 'REFUNDED' }),
          ...(query?.patientId && { patientId: query.patientId }),
        },
        include: {
          patient: { select: { name: true, medicalNumber: true } },
          appointment: { select: { appointmentDate: true, doctor: { select: { name: true } } } },
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.billing.count({
        where: {
          ...(query?.status && { status: query.status as 'DRAFT' | 'PENDING' | 'PAID' | 'PARTIAL' | 'CANCELLED' | 'REFUNDED' }),
          ...(query?.patientId && { patientId: query.patientId }),
        },
      }),
    ]);
    return { data, total, page, limit };
  }

  async findById(id: string) {
    const billing = await this.prisma.billing.findUnique({
      where: { id },
      include: {
        patient: true,
        appointment: { include: { doctor: true, service: true, branch: true } },
        payments: true,
      },
    });
    if (!billing) throw new NotFoundException('Invoice tidak ditemukan');
    return billing;
  }

  async create(dto: {
    appointmentId: string;
    patientId: string;
    items: object;
    subtotal: number;
    discount?: number;
    tax?: number;
    totalAmount: number;
  }) {
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
    return this.prisma.billing.create({
      data: {
        invoiceNumber,
        appointmentId: dto.appointmentId,
        patientId: dto.patientId,
        items: dto.items,
        subtotal: dto.subtotal,
        discount: dto.discount ?? 0,
        tax: dto.tax ?? 0,
        totalAmount: dto.totalAmount,
        status: 'PENDING',
      },
    });
  }

  async recordPayment(billingId: string, dto: { amount: number; method: string; referenceNo?: string; notes?: string }) {
    const billing = await this.prisma.billing.findUnique({ where: { id: billingId } });
    if (!billing) throw new NotFoundException('Invoice tidak ditemukan');

    const payment = await this.prisma.payment.create({
      data: {
        billingId,
        amount: dto.amount,
        method: dto.method as 'CASH' | 'CARD' | 'TRANSFER' | 'QRIS' | 'INSURANCE',
        referenceNo: dto.referenceNo,
        notes: dto.notes,
      },
    });

    const totalPaid = await this.prisma.payment.aggregate({
      where: { billingId },
      _sum: { amount: true },
    });

    const paid = Number(totalPaid._sum?.amount ?? 0);
    const total = Number(billing.totalAmount);
    const status = paid >= total ? 'PAID' : 'PARTIAL';
    await this.prisma.billing.update({ where: { id: billingId }, data: { status, ...(status === 'PAID' && { paidAt: new Date() }) } });

    return payment;
  }
}
