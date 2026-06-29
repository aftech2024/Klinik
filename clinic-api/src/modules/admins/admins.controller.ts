import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminsService } from './admins.service';
import { Roles, RolesGuard } from '../../common/guards/roles.guard';

@Controller('api/admins')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('SUPER_ADMIN')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  list() {
    return this.adminsService.listClinicAdmins();
  }

  @Post()
  create(@Body() data: { name: string; email: string; password?: string; branchId: string }) {
    return this.adminsService.createClinicAdmin(data);
  }

  @Patch(':id/active')
  setActive(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.adminsService.setActive(id, isActive);
  }

  @Patch(':id/branch')
  reassign(@Param('id') id: string, @Body('branchId') branchId: string) {
    return this.adminsService.reassignBranch(id, branchId);
  }
}

// Cashier management — SUPER_ADMIN global, ADMIN for own branch
@Controller('api/cashiers')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('SUPER_ADMIN', 'ADMIN')
export class CashiersController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  list(@Req() req: any) {
    const branchId = req.user.role === 'ADMIN' ? req.user.branchId : null;
    return this.adminsService.listCashiers(branchId);
  }

  @Post()
  create(@Body() dto: any, @Req() req: any) {
    // ADMIN can only create cashier for their own branch
    const branchId = req.user.role === 'ADMIN' ? req.user.branchId : dto.branchId;
    return this.adminsService.createCashier({ ...dto, branchId });
  }

  @Patch(':id/active')
  @Roles('SUPER_ADMIN', 'ADMIN')
  setActive(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.adminsService.setActive(id, isActive);
  }
}
