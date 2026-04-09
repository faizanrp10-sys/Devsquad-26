import { IsMongoId, IsEnum } from 'class-validator';
import { NotificationType } from '../schemas/notification.schema';

export class CreateNotificationDto {
  @IsMongoId()
  recipient: string;

  @IsMongoId()
  actor: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsMongoId()
  comment?: string;

  message: string;
}
