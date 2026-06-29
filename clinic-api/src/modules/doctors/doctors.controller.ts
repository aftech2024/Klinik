import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DoctorsService } from './doctors.service';
import { Roles, RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Doctors')
@Controller('api/doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all doctors with optional filters' })
  findAll(
    @Query('specialty') specialty?: string,
    @Query('branchId') branchId?: string,
    @Query('search') search?: string,
  ) {
    return this.doctorsService.findAll({ specialty, branchId, search });
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated doctor profile' })
  getMyProfile(@Req() req: any) {
    return this.doctorsService.findByUserId(req.user.id);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get doctor detail by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.doctorsService.findBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create doctor — full onboarding (Admin)' })
  create(@Body() data: any, @Req() req: any) {
    return this.doctorsService.createDoctor(data, { role: req.user.role, branchId: req.user.branchId });
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update doctor (Admin)' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.doctorsService.update(id, data);
  }

  @Post(':id/branches')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign branch to doctor' })
  addBranch(@Param('id') id: string, @Body('branchId') branchId: string) {
    return this.doctorsService.addBranch(id, branchId);
  }

  @Post(':id/branches/remove')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove branch from doctor' })
  removeBranch(@Param('id') id: string, @Body('branchId') branchId: string) {
    return this.doctorsService.removeBranch(id, branchId);
  }
}
