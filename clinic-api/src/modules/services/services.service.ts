import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query?: { category?: string }) {
    return this.prisma.service.findMany({
      where: {
        isActive: true,
        ...(query?.category && { category: query.category }),
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.service.findUnique({ where: { slug } });
  }

  async create(data: { name: string; slug: string; description?: string; category?: string; price?: number }) {
    return this.prisma.service.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.service.update({ where: { id }, data });
  }
}
