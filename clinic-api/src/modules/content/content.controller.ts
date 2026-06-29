import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ContentService } from './content.service';

@ApiTags('Content')
@Controller('api')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get('promotions')
  @ApiOperation({ summary: 'Get active promotions' })
  getPromotions() {
    return this.contentService.getPromotions();
  }

  @Get('promotions/:slug')
  @ApiOperation({ summary: 'Get promotion detail' })
  getPromotionBySlug(@Param('slug') slug: string) {
    return this.contentService.getPromotionBySlug(slug);
  }

  @Get('articles')
  @ApiOperation({ summary: 'Get published articles' })
  getArticles(@Query('category') category?: string, @Query('search') search?: string) {
    return this.contentService.getArticles({ category, search });
  }

  @Get('articles/:slug')
  @ApiOperation({ summary: 'Get article detail' })
  getArticleBySlug(@Param('slug') slug: string) {
    return this.contentService.getArticleBySlug(slug);
  }

  @Get('faqs')
  @ApiOperation({ summary: 'Get FAQs' })
  getFaqs(@Query('category') category?: string) {
    return this.contentService.getFaqs(category);
  }

  @Get('testimonials')
  @ApiOperation({ summary: 'Get testimonials' })
  getTestimonials() {
    return this.contentService.getTestimonials();
  }
}
