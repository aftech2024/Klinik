import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentsService } from './appointments.service';
import { Roles, RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Appointments')
@Controller('api/appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create appointment' })
  create(@Body() body: any, @Req() req: any) {
    return this.appointmentsService.create({ ...body, userId: req.user.id });
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my appointments' })
  findMy(@Req() req: any) {
    return this.appointmentsService.findByPatient(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get appointment detail by ID' })
  findById(@Param('id') id: string) {
    return this.appointmentsService.findById(id);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all appointments (Admin/Doctor)' })
  findAll(
    @Query('branchId') branchId?: string,
    @Query('status') status?: string,
    @Query('date') date?: string,
  ) {
    return this.appointmentsService.findAll({ branchId, status, date });
  }

  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update appointment status' })
  updateStatus(@Param('id') id: string, @Body() body: { status: string; cancelReason?: string }) {
    return this.appointmentsService.updateStatus(id, body.status, body.cancelReason);
  }
}
