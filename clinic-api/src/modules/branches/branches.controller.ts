import { Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BranchesService } from './branches.service';
import { Roles, RolesGuard } from '../../common/guards/roles.guard';

@ApiTags('Branches')
@Controller('api/branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all branches' })
  findAll(@Query('city') city?: string) {
    return this.branchesService.findAll({ city });
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get branch by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.branchesService.findBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create branch (Admin)' })
  create(@Body() data: any) {
    return this.branchesService.create(data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update branch (Admin)' })
  update(@Param('id') id: string, @Body() data: any) {
    return this.branchesService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete branch (Admin)' })
  delete(@Param('id') id: string) {
    return this.branchesService.delete(id);
  }
}
