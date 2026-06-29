import { Controller, Get, Patch, Param, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('api/notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Get()
  getMyNotifications(@Request() req: any, @Query('unread') unread?: string) {
    return this.service.getUserNotifications(req.user.id, unread === 'true');
  }

  @Patch(':id/read')
  markRead(@Param('id') id: string) {
    return this.service.markRead(id);
  }

  @Patch('read-all')
  markAllRead(@Request() req: any) {
    return this.service.markAllRead(req.user.id);
  }
}
