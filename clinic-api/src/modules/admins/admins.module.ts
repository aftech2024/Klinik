import { Module } from '@nestjs/common';
import { AdminsController, CashiersController } from './admins.controller';
import { AdminsService } from './admins.service';

@Module({
  controllers: [AdminsController, CashiersController],
  providers: [AdminsService],
  exports: [AdminsService],
})
export class AdminsModule {}
