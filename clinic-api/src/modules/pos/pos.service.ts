import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PosService {
  constructor(private prisma: PrismaService) {}

  private async nextTransactionNo(branchId: string): Promise<string> {
    const today = new Date();
    const prefix = `TRX${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
    const count = await this.prisma.posTransaction.count({
      where: { branchId, createdAt: { gte: new Date(today.getFullYear(), today.getMonth(), today.getDate()) } },
    });
    return `${prefix}-${String(count + 1).padStart(4, '0')}`;
  }

  async createTransaction(dto: {
    branchId: string;
    cashierId: string;
    patientId?: string;
    items: Array<{ medicineId: string; quantity: number; unitPrice: number }>;
    paidAmount: number;
    paymentMethod?: string;
    notes?: string;
  }) {
    // Validate + calculate
    const medicineIds = dto.items.map(i => i.medicineId);
    const stocks = await this.prisma.productStock.findMany({
      where: { branchId: dto.branchId, medicineId: { in: medicineIds } },
    });

    const stockMap = new Map(stocks.map(s => [s.medicineId, s]));

    for (const item of dto.items) {
      const stock = stockMap.get(item.medicineId);
      if (!stock) throw new BadRequestException(`Stok obat tidak ditemukan di klinik ini`);
      if (stock.quantity < item.quantity) {
        throw new BadRequestException(`Stok tidak cukup (tersedia: ${stock.quantity})`);
      }
    }

    const totalAmount = dto.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    if (dto.paidAmount < totalAmount) {
      throw new BadRequestException('Jumlah bayar kurang dari total');
    }
    const changeAmount = dto.paidAmount - totalAmount;
    const transactionNo = await this.nextTransactionNo(dto.branchId);

    const transaction = await this.prisma.$transaction(async (tx) => {
      // Create transaction + items
      const trx = await tx.posTransaction.create({
        data: {
          transactionNo,
          branchId: dto.branchId,
          cashierId: dto.cashierId,
          patientId: dto.patientId ?? null,
          totalAmount,
          paidAmount: dto.paidAmount,
          changeAmount,
          paymentMethod: (dto.paymentMethod as any) ?? 'CASH',
          notes: dto.notes,
          items: {
            create: dto.items.map(i => ({
              medicineId: i.medicineId,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              subtotal: i.unitPrice * i.quantity,
            })),
          },
        },
        include: {
          items: { include: { medicine: true } },
          cashier: { select: { id: true, name: true } },
          patient: { select: { id: true, name: true, medicalNumber: true } },
        },
      });

      // Deduct stock + write adjustment per item
      for (const item of dto.items) {
        await tx.productStock.update({
          where: { medicineId_branchId: { medicineId: item.medicineId, branchId: dto.branchId } },
          data: { quantity: { decrement: item.quantity } },
        });
        await tx.stockAdjustment.create({
          data: {
            medicineId: item.medicineId,
            branchId: dto.branchId,
            userId: dto.cashierId,
            type: 'SALE',
            quantity: -item.quantity,
            reason: `POS ${transactionNo}`,
            refId: trx.id,
          },
        });
      }

      return trx;
    });

    return transaction;
  }

  async getTransactions(query: { branchId?: string; from?: string; to?: string; limit?: number }) {
    return this.prisma.posTransaction.findMany({
      where: {
        ...(query.branchId && { branchId: query.branchId }),
        ...(query.from && query.to && {
          createdAt: { gte: new Date(query.from), lte: new Date(query.to + 'T23:59:59') },
        }),
      },
      include: {
        items: { include: { medicine: { select: { id: true, name: true, unit: true } } } },
        cashier: { select: { id: true, name: true } },
        patient: { select: { id: true, name: true, medicalNumber: true } },
        branch: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: query.limit ?? 50,
    });
  }

  async getTransactionById(id: string) {
    const trx = await this.prisma.posTransaction.findUnique({
      where: { id },
      include: {
        items: { include: { medicine: true } },
        cashier: { select: { id: true, name: true } },
        patient: { select: { id: true, name: true, medicalNumber: true } },
        branch: { select: { id: true, name: true, address: true } },
      },
    });
    if (!trx) throw new NotFoundException('Transaksi tidak ditemukan');
    return trx;
  }

  async getDailySummary(branchId: string, date?: string) {
    const day = date ? new Date(date) : new Date();
    day.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);

    const [transactions, revenue] = await Promise.all([
      this.prisma.posTransaction.count({ where: { branchId, createdAt: { gte: day, lt: nextDay } } }),
      this.prisma.posTransaction.aggregate({
        where: { branchId, createdAt: { gte: day, lt: nextDay } },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      date: day.toISOString().split('T')[0],
      totalTransactions: transactions,
      totalRevenue: Number(revenue._sum?.totalAmount ?? 0),
    };
  }
}
