import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { PatientsService } from './patients.service';

@Controller('api/patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE')
  findAll(
    @Query('search') search?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.patientsService.findAll({
      search,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE')
  findById(@Param('id') id: string) {
    return this.patientsService.findById(id);
  }

  @Get('medical-number/:number')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE')
  findByMedicalNumber(@Param('number') number: string) {
    return this.patientsService.findByMedicalNumber(number);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.patientsService.update(id, dto);
  }
}
