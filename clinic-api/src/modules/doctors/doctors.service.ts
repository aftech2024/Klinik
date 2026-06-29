import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';

type Actor = { role: string; branchId?: string | null };

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  private slugify(name: string) {
    const base = name
      .toLowerCase()
      .replace(/^dr[g]?\.?\s*/i, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${base}-${Math.random().toString(36).slice(2, 6)}`;
  }

  async findAll(query?: { specialty?: string; branchId?: string; search?: string }) {
    return this.prisma.doctor.findMany({
      where: {
        isActive: true,
        ...(query?.specialty && { specialty: { contains: query.specialty, mode: 'insensitive' as const } }),
        ...(query?.branchId && {
          branches: { some: { branchId: query.branchId } },
        }),
        ...(query?.search && {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' as const } },
            { specialty: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }),
      },
      include: {
        branches: {
          include: { branch: { select: { id: true, name: true, slug: true, city: true } } },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.doctor.findUnique({
      where: { userId },
      include: {
        branches: {
          include: { branch: { select: { id: true, name: true, slug: true, city: true } } },
        },
        schedules: {
          where: { isActive: true },
          include: { branch: { select: { id: true, name: true } } },
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.doctor.findUnique({
      where: { slug },
      include: {
        branches: {
          include: { branch: true },
        },
        schedules: {
          where: { isActive: true },
          include: { branch: { select: { id: true, name: true } } },
          orderBy: { dayOfWeek: 'asc' },
        },
      },
    });
  }

  // Full doctor onboarding: creates User (role DOCTOR) + Doctor + branch link.
  // ADMIN is forced to their own clinic; SUPER_ADMIN must specify branchId.
  async createDoctor(
    dto: {
      name: string;
      specialty: string;
      email: string;
      password?: string;
      licenseNumber?: string;
      bio?: string;
      experience?: number;
      branchId?: string;
    },
    actor: Actor,
  ) {
    const targetBranchId = actor.role === 'ADMIN' ? actor.branchId : dto.branchId;
    if (!targetBranchId) {
      throw new BadRequestException('branchId (klinik) wajib dipilih');
    }
    if (!dto.email || !dto.name || !dto.specialty) {
      throw new BadRequestException('name, email, specialty wajib diisi');
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Email sudah terdaftar');
    }

    const branch = await this.prisma.branch.findUnique({ where: { id: targetBranchId } });
    if (!branch) {
      throw new BadRequestException('Klinik tidak ditemukan');
    }

    const passwordHash = await bcrypt.hash(dto.password || 'dokter123456', 12);
    const slug = this.slugify(dto.name);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        name: dto.name,
        role: 'DOCTOR',
        isVerified: true,
      },
    });

    const doctor = await this.prisma.doctor.create({
      data: {
        userId: user.id,
        name: dto.name,
        slug,
        specialty: dto.specialty,
        licenseNumber: dto.licenseNumber,
        bio: dto.bio,
        experience: dto.experience,
        branches: { create: { branchId: targetBranchId } },
      },
      include: {
        branches: { include: { branch: { select: { id: true, name: true, city: true } } } },
      },
    });

    return doctor;
  }

  async update(id: string, data: any) {
    return this.prisma.doctor.update({ where: { id }, data });
  }

  async addBranch(doctorId: string, branchId: string) {
    await this.prisma.doctor.update({
      where: { id: doctorId },
      data: {
        branches: {
          upsert: {
            where: { doctorId_branchId: { doctorId, branchId } },
            create: { branchId },
            update: {},
          },
        },
      },
    });
    return this.findById(doctorId);
  }

  async removeBranch(doctorId: string, branchId: string) {
    await this.prisma.doctor.update({
      where: { id: doctorId },
      data: {
        branches: {
          delete: { doctorId_branchId: { doctorId, branchId } },
        },
      },
    });
    return this.findById(doctorId);
  }

  private findById(id: string) {
    return this.prisma.doctor.findUnique({
      where: { id },
      include: { branches: { include: { branch: { select: { id: true, name: true, city: true } } } } },
    });
  }
}
