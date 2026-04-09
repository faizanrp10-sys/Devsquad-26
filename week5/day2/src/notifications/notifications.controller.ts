import { Controller, Get, Post, Patch, Delete, Param, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';
import { Notification } from './schemas/notification.schema';

@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getNotifications(
    @Request() req: any,
    @Query('limit') limit: string = '20',
  ): Promise<Notification[]> {
    return this.notificationsService.getNotifications(req.user.id, parseInt(limit));
  }

  @Get('/unread')
  @UseGuards(JwtAuthGuard)
  async getUnreadNotifications(@Request() req: any): Promise<Notification[]> {
    return this.notificationsService.getUnreadNotifications(req.user.id);
  }

  @Get('/unread-count')
  @UseGuards(JwtAuthGuard)
  async getUnreadCount(@Request() req: any): Promise<{ count: number }> {
    const count = await this.notificationsService.getUnreadCount(req.user.id);
    return { count };
  }

  @Patch('/:id/read')
  @UseGuards(JwtAuthGuard)
  async markAsRead(@Param('id') id: string): Promise<Notification> {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('/mark-all-read')
  @UseGuards(JwtAuthGuard)
  async markAllAsRead(@Request() req: any): Promise<{ message: string }> {
    await this.notificationsService.markAllAsRead(req.user.id);
    return { message: 'All notifications marked as read' };
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteNotification(@Param('id') id: string): Promise<{ message: string }> {
    await this.notificationsService.deleteNotification(id);
    return { message: 'Notification deleted successfully' };
  }
}
