import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PatientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { search?: string; page?: number; limit?: number }) {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = query?.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' as const } },
            { medicalNumber: { contains: query.search, mode: 'insensitive' as const } },
            { user: { email: { contains: query.search, mode: 'insensitive' as const } } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        where,
        include: { user: { select: { email: true, phone: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.patient.count({ where }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        user: { select: { email: true, phone: true, isActive: true } },
        appointments: {
          orderBy: { appointmentDate: 'desc' },
          take: 5,
          include: { doctor: { select: { name: true, specialty: true } } },
        },
      },
    });
    if (!patient) throw new NotFoundException('Pasien tidak ditemukan');
    return patient;
  }

  async findByMedicalNumber(medicalNumber: string) {
    const patient = await this.prisma.patient.findUnique({ where: { medicalNumber } });
    if (!patient) throw new NotFoundException('Pasien tidak ditemukan');
    return patient;
  }

  async update(id: string, dto: {
    name?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    bloodType?: string;
    allergies?: string[];
    emergencyContact?: object;
  }) {
    return this.prisma.patient.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.dateOfBirth && { dateOfBirth: new Date(dto.dateOfBirth) }),
        ...(dto.gender && { gender: dto.gender as 'MALE' | 'FEMALE' }),
        ...(dto.address && { address: dto.address }),
        ...(dto.bloodType && { bloodType: dto.bloodType }),
        ...(dto.allergies && { allergies: dto.allergies }),
        ...(dto.emergencyContact && { emergencyContact: dto.emergencyContact }),
      },
    });
  }
}
