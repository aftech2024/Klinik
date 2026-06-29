import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { MedicalRecordsService } from './medical-records.service';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@Controller('api/medical-records')
@UseGuards(JwtAuthGuard)
export class MedicalRecordsController {
  constructor(private readonly service: MedicalRecordsService) {}

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get medical records by patient' })
  findByPatient(
    @Param('patientId') patientId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findByPatient(patientId, parseInt(page ?? '1'), parseInt(limit ?? '10'));
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current patient\'s medical records' })
  findMy(@Req() req: any) {
    return this.service.findByPatient(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get medical record detail' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create medical record with SOAP + prescriptions' })
  create(@Body() dto: any, @Req() req: any) {
    return this.service.create({ ...dto, doctorId: dto.doctorId ?? req.user.id });
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update medical record' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }

  @Post(':id/prescriptions')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add prescription to medical record' })
  addPrescription(@Param('id') id: string, @Body() dto: { medicineId: string; name: string; dosage: string; quantity: number; notes?: string }) {
    return this.service.addPrescription(id, dto);
  }

  @Delete(':id/prescriptions/:index')
  @UseGuards(RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove prescription from medical record' })
  removePrescription(@Param('id') id: string, @Param('index') index: string) {
    return this.service.removePrescription(id, parseInt(index));
  }
}
