import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { city?: string; isActive?: boolean }) {
    return this.prisma.branch.findMany({
      where: {
        isActive: query?.isActive ?? true,
        ...(query?.city && { city: { contains: query.city, mode: 'insensitive' as const } }),
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.branch.findUnique({
      where: { slug },
      include: {
        doctors: {
          include: {
            doctor: {
              select: { id: true, name: true, slug: true, specialty: true, photoUrl: true },
            },
          },
        },
      },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    address: string;
    city: string;
    province?: string;
    phone?: string;
    email?: string;
    facilities?: any;
    operatingHours?: any;
    latitude?: number;
    longitude?: number;
  }) {
    return this.prisma.branch.create({ data });
  }

  async update(id: string, data: Partial<Parameters<typeof this.create>[0]>) {
    return this.prisma.branch.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.branch.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
