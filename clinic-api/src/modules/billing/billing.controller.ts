import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { BillingService } from './billing.service';

@Controller('api/billing')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingController {
  constructor(private readonly service: BillingService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  findAll(
    @Query('status') status?: string,
    @Query('patientId') patientId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findAll({ status, patientId, page: parseInt(page ?? '1'), limit: parseInt(limit ?? '20') });
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER', 'DOCTOR')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Post(':id/payment')
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  recordPayment(@Param('id') id: string, @Body() dto: any) {
    return this.service.recordPayment(id, dto);
  }
}
