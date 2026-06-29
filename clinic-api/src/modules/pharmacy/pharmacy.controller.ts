import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../common/guards/roles.guard';
import { PharmacyService } from './pharmacy.service';

@Controller('api/pharmacy')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PharmacyController {
  constructor(private readonly service: PharmacyService) {}

  // ─── MEDICINE CATALOG ────────────────────────────────────────────────

  @Get('medicines')
  @Roles('SUPER_ADMIN', 'ADMIN', 'PHARMACIST', 'CASHIER', 'DOCTOR')
  getMedicines(@Query('search') search?: string, @Query('branchId') branchId?: string) {
    return this.service.getMedicines({ search, branchId });
  }

  @Get('medicines/:id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'PHARMACIST', 'CASHIER', 'DOCTOR')
  getMedicineById(@Param('id') id: string) {
    return this.service.getMedicineById(id);
  }

  @Post('medicines')
  @Roles('SUPER_ADMIN', 'ADMIN', 'PHARMACIST')
  createMedicine(@Body() dto: any) {
    return this.service.createMedicine(dto);
  }

  @Patch('medicines/:id')
  @Roles('SUPER_ADMIN', 'ADMIN', 'PHARMACIST')
  updateMedicine(@Param('id') id: string, @Body() dto: any) {
    return this.service.updateMedicine(id, dto);
  }

  // ─── STOCK PER BRANCH ────────────────────────────────────────────────

  @Get('stock')
  @Roles('SUPER_ADMIN', 'ADMIN', 'PHARMACIST', 'CASHIER')
  getStock(@Query('branchId') branchId: string, @Query('search') search?: string, @Query('lowStock') lowStock?: string, @Req() req?: any) {
    // ADMIN scoped to own branch
    const targetBranch = req?.user?.role === 'ADMIN' ? req.user.branchId : branchId;
    return this.service.getStock(targetBranch, { search, lowStock: lowStock === 'true' });
  }

  @Get('stock/global')
  @Roles('SUPER_ADMIN')
  getAllStockGlobal(@Query('search') search?: string) {
    return this.service.getAllStockGlobal({ search });
  }

  @Get('stock/history')
  @Roles('SUPER_ADMIN', 'ADMIN', 'PHARMACIST')
  getStockHistory(@Query('branchId') branchId: string, @Query('medicineId') medicineId?: string, @Req() req?: any) {
    const targetBranch = req?.user?.role === 'ADMIN' ? req.user.branchId : branchId;
    return this.service.getStockHistory(targetBranch, medicineId);
  }

  @Post('stock/adjust')
  @Roles('SUPER_ADMIN', 'ADMIN', 'PHARMACIST')
  adjustStock(@Body() dto: any, @Req() req: any) {
    const branchId = req.user.role === 'ADMIN' ? req.user.branchId : dto.branchId;
    return this.service.adjustStock({ ...dto, branchId, userId: req.user.id });
  }

  // ─── STOCK TRANSFER ──────────────────────────────────────────────────

  @Get('transfers')
  @Roles('SUPER_ADMIN', 'ADMIN')
  getTransfers(@Query('branchId') branchId?: string, @Query('status') status?: string, @Req() req?: any) {
    const targetBranch = req?.user?.role === 'ADMIN' ? req.user.branchId : branchId;
    return this.service.getTransfers({ branchId: targetBranch, status });
  }

  @Post('transfers')
  @Roles('SUPER_ADMIN', 'ADMIN')
  requestTransfer(@Body() dto: any, @Req() req: any) {
    return this.service.requestTransfer({ ...dto, requestedById: req.user.id });
  }

  @Patch('transfers/:id/approve')
  @Roles('SUPER_ADMIN')
  approveTransfer(@Param('id') id: string, @Req() req: any) {
    return this.service.approveTransfer(id, req.user.id);
  }

  @Patch('transfers/:id/reject')
  @Roles('SUPER_ADMIN')
  rejectTransfer(@Param('id') id: string, @Req() req: any) {
    return this.service.rejectTransfer(id, req.user.id);
  }
}
