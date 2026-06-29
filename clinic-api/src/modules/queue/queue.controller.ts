import { Controller, Get, Post, Patch, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { QueueService } from './queue.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  getMyQueue(@Req() req: any) {
    return this.queueService.getMyQueue(req.user.id);
  }

  @Get(':branchId')
  getByBranch(@Param('branchId') branchId: string, @Query('date') date?: string) {
    return this.queueService.getByBranch(branchId, date);
  }

  @Get(':branchId/stats')
  getStats(@Param('branchId') branchId: string) {
    return this.queueService.getStats(branchId);
  }

  @Post(':branchId/call-next')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE')
  callNext(@Param('branchId') branchId: string, @Body('doctorId') doctorId?: string) {
    return this.queueService.callNext(branchId, doctorId);
  }

  @Patch(':queueId/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'NURSE')
  updateStatus(@Param('queueId') queueId: string, @Body('status') status: string) {
    return this.queueService.updateStatus(queueId, status);
  }
}
