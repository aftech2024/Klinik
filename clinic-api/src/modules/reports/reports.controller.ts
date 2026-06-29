import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { ReportsService } from './reports.service';

@Controller('api/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('dashboard')
  getDashboard(@Req() req: any) {
    // Clinic admin → scoped to their branch; super admin → global
    const branchId = req.user.role === 'ADMIN' ? req.user.branchId : null;
    return this.service.getDashboardKpi(branchId);
  }

  @Get('appointments')
  getAppointments(@Query('from') from: string, @Query('to') to: string, @Query('branchId') branchId?: string) {
    return this.service.getAppointmentStats(from, to, branchId);
  }

  @Get('revenue')
  getRevenue(@Query('from') from: string, @Query('to') to: string) {
    return this.service.getRevenueSummary(from, to);
  }

  @Get('top-doctors')
  getTopDoctors(@Query('limit') limit?: string) {
    return this.service.getTopDoctors(parseInt(limit ?? '5'));
  }
}
