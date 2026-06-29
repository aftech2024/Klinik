import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  // Promotions
  async getPromotions() {
    const now = new Date();
    return this.prisma.promotion.findMany({
      where: { isActive: true, startDate: { lte: now }, endDate: { gte: now } },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getPromotionBySlug(slug: string) {
    return this.prisma.promotion.findUnique({ where: { slug } });
  }

  // Articles
  async getArticles(query?: { category?: string; search?: string; limit?: number }) {
    return this.prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        ...(query?.category && { category: query.category }),
        ...(query?.search && {
          OR: [
            { title: { contains: query.search, mode: 'insensitive' as const } },
            { content: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }),
      },
      orderBy: { publishedAt: 'desc' },
      take: query?.limit || 20,
    });
  }

  async getArticleBySlug(slug: string) {
    await this.prisma.article.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });
    return this.prisma.article.findUnique({ where: { slug } });
  }

  // FAQs
  async getFaqs(category?: string) {
    return this.prisma.faq.findMany({
      where: { isActive: true, ...(category && { category }) },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // Testimonials
  async getTestimonials() {
    return this.prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }
}
