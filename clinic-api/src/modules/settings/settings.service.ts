import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.setting.findMany({ orderBy: { key: 'asc' } });
  }

  async get(key: string) {
    return this.prisma.setting.findUnique({ where: { key } });
  }

  async set(key: string, value: string, group?: string) {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value, ...(group && { group }) },
      create: { key, value, ...(group && { group }) },
    });
  }

  async setBulk(settings: { key: string; value: string; group?: string }[]) {
    return Promise.all(settings.map((s) => this.set(s.key, s.value, s.group)));
  }
}
