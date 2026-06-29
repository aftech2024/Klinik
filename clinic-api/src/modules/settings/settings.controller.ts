import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { SettingsService } from './settings.service';

@Controller('api/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get()
  getAll() { return this.service.getAll(); }

  @Get(':key')
  get(@Param('key') key: string) { return this.service.get(key); }

  @Put(':key')
  set(@Param('key') key: string, @Body('value') value: string, @Body('description') description?: string) {
    return this.service.set(key, value, description);
  }

  @Put()
  setBulk(@Body() settings: { key: string; value: string }[]) {
    return this.service.setBulk(settings);
  }
}
