import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { NotificationsModule } from '../notifications/notifications.module';
import { CommentsModule } from '../comments/comments.module';
import { LikesModule } from '../likes/likes.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [NotificationsModule, CommentsModule, LikesModule, UsersModule],
  providers: [ChatGateway],
})
export class GatewayModule {}
