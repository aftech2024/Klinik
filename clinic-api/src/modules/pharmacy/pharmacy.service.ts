import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PharmacyService {
  constructor(private prisma: PrismaService) {}

  // ─── MEDICINE CATALOG ────────────────────────────────────────────────

  async getMedicines(query?: { search?: string; branchId?: string }) {
    const medicines = await this.prisma.medicine.findMany({
      where: {
        isActive: true,
        ...(query?.search && { name: { contains: query.search, mode: 'insensitive' as const } }),
      },
      include: {
        productStocks: query?.branchId
          ? { where: { branchId: query.branchId } }
          : true,
      },
      orderBy: { name: 'asc' },
    });
    return medicines;
  }

  async getMedicineById(id: string) {
    const med = await this.prisma.medicine.findUnique({
      where: { id },
      include: { productStocks: { include: { branch: { select: { id: true, name: true, city: true } } } } },
    });
    if (!med) throw new NotFoundException('Obat tidak ditemukan');
    return med;
  }

  async createMedicine(dto: {
    code: string;
    name: string;
    genericName?: string;
    category?: string;
    unit: string;
    price: number;
    isActive?: boolean;
  }) {
    return this.prisma.medicine.create({ data: dto });
  }

  async updateMedicine(id: string, dto: Partial<{
    name: string; genericName: string; category: string;
    unit: string; price: number; isActive: boolean;
  }>) {
    await this.getMedicineById(id);
    return this.prisma.medicine.update({ where: { id }, data: dto });
  }

  // ─── STOCK PER BRANCH ────────────────────────────────────────────────

  async getStock(branchId: string, query?: { search?: string; lowStock?: boolean }) {
    const stocks = await this.prisma.productStock.findMany({
      where: {
        branchId,
        medicine: {
          isActive: true,
          ...(query?.search && { name: { contains: query.search, mode: 'insensitive' as const } }),
        },
        ...(query?.lowStock && { quantity: { lte: this.prisma.productStock.fields.minStock } }),
      },
      include: {
        medicine: true,
        branch: { select: { id: true, name: true } },
      },
      orderBy: { medicine: { name: 'asc' } },
    });

    if (query?.lowStock) {
      return stocks.filter(s => s.quantity <= s.minStock);
    }
    return stocks;
  }

  async getAllStockGlobal(query?: { search?: string }) {
    return this.prisma.productStock.findMany({
      where: {
        medicine: {
          isActive: true,
          ...(query?.search && { name: { contains: query.search, mode: 'insensitive' as const } }),
        },
      },
      include: {
        medicine: true,
        branch: { select: { id: true, name: true, city: true } },
      },
      orderBy: [{ branch: { name: 'asc' } }, { medicine: { name: 'asc' } }],
    });
  }

  async adjustStock(dto: {
    medicineId: string;
    branchId: string;
    quantity: number; // positif = tambah, negatif = kurang
    type: string;
    reason?: string;
    refId?: string;
    userId: string;
  }) {
    const existing = await this.prisma.productStock.findUnique({
      where: { medicineId_branchId: { medicineId: dto.medicineId, branchId: dto.branchId } },
    });

    const newQty = (existing?.quantity ?? 0) + dto.quantity;
    if (newQty < 0) throw new BadRequestException('Stok tidak mencukupi');

    const [stock] = await this.prisma.$transaction([
      existing
        ? this.prisma.productStock.update({
            where: { medicineId_branchId: { medicineId: dto.medicineId, branchId: dto.branchId } },
            data: { quantity: { increment: dto.quantity } },
          })
        : this.prisma.productStock.create({
            data: {
              medicineId: dto.medicineId,
              branchId: dto.branchId,
              quantity: Math.max(0, dto.quantity),
            },
          }),
      this.prisma.stockAdjustment.create({
        data: {
          medicineId: dto.medicineId,
          branchId: dto.branchId,
          userId: dto.userId,
          type: dto.type,
          quantity: dto.quantity,
          reason: dto.reason,
          refId: dto.refId,
        },
      }),
    ]);

    return stock;
  }

  async getStockHistory(branchId: string, medicineId?: string) {
    return this.prisma.stockAdjustment.findMany({
      where: { branchId, ...(medicineId && { medicineId }) },
      include: {
        medicine: { select: { id: true, name: true, unit: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  // ─── STOCK TRANSFER (JOIN INVENTORY) ─────────────────────────────────

  async requestTransfer(dto: {
    medicineId: string;
    fromBranchId: string;
    toBranchId: string;
    quantity: number;
    notes?: string;
    requestedById: string;
  }) {
    const fromStock = await this.prisma.productStock.findUnique({
      where: { medicineId_branchId: { medicineId: dto.medicineId, branchId: dto.fromBranchId } },
    });
    if (!fromStock || fromStock.quantity < dto.quantity) {
      throw new BadRequestException('Stok cabang asal tidak mencukupi untuk transfer');
    }

    return this.prisma.stockTransfer.create({
      data: {
        medicineId: dto.medicineId,
        fromBranchId: dto.fromBranchId,
        toBranchId: dto.toBranchId,
        quantity: dto.quantity,
        notes: dto.notes,
        requestedById: dto.requestedById,
      },
      include: {
        medicine: { select: { id: true, name: true, unit: true } },
        fromBranch: { select: { id: true, name: true } },
        toBranch: { select: { id: true, name: true } },
      },
    });
  }

  async getTransfers(query?: { branchId?: string; status?: string }) {
    return this.prisma.stockTransfer.findMany({
      where: {
        ...(query?.branchId && {
          OR: [{ fromBranchId: query.branchId }, { toBranchId: query.branchId }],
        }),
        ...(query?.status && { status: query.status }),
      },
      include: {
        medicine: { select: { id: true, name: true, unit: true } },
        fromBranch: { select: { id: true, name: true, city: true } },
        toBranch: { select: { id: true, name: true, city: true } },
        requestedBy: { select: { id: true, name: true } },
        approvedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveTransfer(id: string, approvedById: string) {
    const transfer = await this.prisma.stockTransfer.findUnique({ where: { id } });
    if (!transfer) throw new NotFoundException('Transfer tidak ditemukan');
    if (transfer.status !== 'PENDING') throw new BadRequestException('Transfer sudah diproses');

    const fromStock = await this.prisma.productStock.findUnique({
      where: { medicineId_branchId: { medicineId: transfer.medicineId, branchId: transfer.fromBranchId } },
    });
    if (!fromStock || fromStock.quantity < transfer.quantity) {
      throw new BadRequestException('Stok cabang asal tidak lagi mencukupi');
    }

    const toExisting = await this.prisma.productStock.findUnique({
      where: { medicineId_branchId: { medicineId: transfer.medicineId, branchId: transfer.toBranchId } },
    });

    await this.prisma.$transaction([
      this.prisma.productStock.update({
        where: { medicineId_branchId: { medicineId: transfer.medicineId, branchId: transfer.fromBranchId } },
        data: { quantity: { decrement: transfer.quantity } },
      }),
      toExisting
        ? this.prisma.productStock.update({
            where: { medicineId_branchId: { medicineId: transfer.medicineId, branchId: transfer.toBranchId } },
            data: { quantity: { increment: transfer.quantity } },
          })
        : this.prisma.productStock.create({
            data: { medicineId: transfer.medicineId, branchId: transfer.toBranchId, quantity: transfer.quantity },
          }),
      this.prisma.stockAdjustment.create({
        data: { medicineId: transfer.medicineId, branchId: transfer.fromBranchId, userId: approvedById, type: 'TRANSFER_OUT', quantity: -transfer.quantity, refId: id },
      }),
      this.prisma.stockAdjustment.create({
        data: { medicineId: transfer.medicineId, branchId: transfer.toBranchId, userId: approvedById, type: 'TRANSFER_IN', quantity: transfer.quantity, refId: id },
      }),
      this.prisma.stockTransfer.update({
        where: { id },
        data: { status: 'APPROVED', approvedById },
      }),
    ]);

    return { message: 'Transfer disetujui dan stok sudah dipindahkan' };
  }

  async rejectTransfer(id: string, approvedById: string) {
    const transfer = await this.prisma.stockTransfer.findUnique({ where: { id } });
    if (!transfer) throw new NotFoundException('Transfer tidak ditemukan');
    if (transfer.status !== 'PENDING') throw new BadRequestException('Transfer sudah diproses');
    return this.prisma.stockTransfer.update({ where: { id }, data: { status: 'REJECTED', approvedById } });
  }
}
