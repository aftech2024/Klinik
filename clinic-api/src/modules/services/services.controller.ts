import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ServicesService } from './services.service';
import { Roles, RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Services')
@Controller('api/services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all clinic services' })
  findAll(@Query('category') category?: string) {
    return this.servicesService.findAll({ category });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get service detail' })
  findBySlug(@Param('slug') slug: string) {
    return this.servicesService.findBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  create(@Body() data: any) {
    return this.servicesService.create(data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() data: any) {
    return this.servicesService.update(id, data);
  }
}
