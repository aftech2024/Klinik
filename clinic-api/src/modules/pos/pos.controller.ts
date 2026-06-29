import { Controller, Get, Post, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { PosService } from './pos.service';

@Controller('api/pos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PosController {
  constructor(private readonly service: PosService) {}

  @Post('transactions')
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER', 'PHARMACIST')
  createTransaction(@Body() dto: any, @Req() req: any) {
    const branchId = req.user.role === 'ADMIN' ? req.user.branchId : dto.branchId;
    return this.service.createTransaction({ ...dto, branchId, cashierId: req.user.id });
  }

  @Get('transactions')
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER', 'PHARMACIST')
  getTransactions(
    @Query('branchId') branchId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: string,
    @Req() req?: any,
  ) {
    const targetBranch = req?.user?.role === 'ADMIN' ? req.user.branchId : branchId;
    return this.service.getTransactions({ branchId: targetBranch, from, to, limit: limit ? +limit : undefined });
  }

  @Get('transactions/:id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER', 'PHARMACIST')
  getTransactionById(@Param('id') id: string) {
    return this.service.getTransactionById(id);
  }

  @Get('summary')
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER', 'PHARMACIST')
  getDailySummary(@Query('branchId') branchId: string, @Query('date') date?: string, @Req() req?: any) {
    const targetBranch = req?.user?.role === 'ADMIN' ? req.user.branchId : branchId;
    return this.service.getDailySummary(targetBranch, date);
  }
}
