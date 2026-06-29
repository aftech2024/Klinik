import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminsService {
  constructor(private prisma: PrismaService) {}

  async listClinicAdmins() {
    return this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        lastLoginAt: true,
        managedBranch: { select: { id: true, name: true, city: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createClinicAdmin(dto: {
    name: string;
    email: string;
    password?: string;
    branchId: string;
  }) {
    if (!dto.name || !dto.email || !dto.branchId) {
      throw new BadRequestException('name, email, branchId wajib diisi');
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email sudah terdaftar');

    const branch = await this.prisma.branch.findUnique({ where: { id: dto.branchId } });
    if (!branch) throw new BadRequestException('Klinik tidak ditemukan');

    const passwordHash = await bcrypt.hash(dto.password || 'admin123456', 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        role: 'ADMIN',
        isVerified: true,
        managedBranchId: dto.branchId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        managedBranch: { select: { id: true, name: true, city: true } },
      },
    });

    return user;
  }

  async listCashiers(branchId?: string | null) {
    return this.prisma.user.findMany({
      where: {
        role: 'CASHIER',
        ...(branchId && { managedBranchId: branchId }),
      },
      select: {
        id: true, name: true, email: true, isActive: true,
        createdAt: true, lastLoginAt: true,
        managedBranch: { select: { id: true, name: true, city: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createCashier(dto: {
    name: string; email: string; password?: string; branchId: string;
  }) {
    if (!dto.name || !dto.email || !dto.branchId) throw new BadRequestException('name, email, branchId wajib diisi');
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email sudah terdaftar');
    const branch = await this.prisma.branch.findUnique({ where: { id: dto.branchId } });
    if (!branch) throw new BadRequestException('Klinik tidak ditemukan');
    const passwordHash = await bcrypt.hash(dto.password || 'kasir123456', 12);
    return this.prisma.user.create({
      data: { email: dto.email, passwordHash, name: dto.name, role: 'CASHIER', isVerified: true, managedBranchId: dto.branchId },
      select: { id: true, name: true, email: true, isActive: true, managedBranch: { select: { id: true, name: true, city: true } } },
    });
  }

  async setActive(id: string, isActive: boolean) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || !['ADMIN', 'CASHIER'].includes(user.role)) throw new NotFoundException('User tidak ditemukan');
    return this.prisma.user.update({
      where: { id },
      data: { isActive },
      select: { id: true, isActive: true },
    });
  }

  async reassignBranch(id: string, branchId: string) {
    const branch = await this.prisma.branch.findUnique({ where: { id: branchId } });
    if (!branch) throw new BadRequestException('Klinik tidak ditemukan');
    return this.prisma.user.update({
      where: { id },
      data: { managedBranchId: branchId },
      select: {
        id: true,
        managedBranch: { select: { id: true, name: true, city: true } },
      },
    });
  }
}
