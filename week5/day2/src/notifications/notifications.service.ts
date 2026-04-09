import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification, NotificationType } from './schemas/notification.schema';
import { CreateNotificationDto } from './dtos/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const notification = new this.notificationModel({
      recipient: new Types.ObjectId(createNotificationDto.recipient),
      actor: new Types.ObjectId(createNotificationDto.actor),
      type: createNotificationDto.type,
      comment: createNotificationDto.comment ? new Types.ObjectId(createNotificationDto.comment) : null,
      message: createNotificationDto.message,
    });

    return (await notification.save()).populate(['recipient', 'actor', 'comment']);
  }

  async getNotifications(userId: string, limit: number = 20): Promise<Notification[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }

    return this.notificationModel
      .find({ recipient: new Types.ObjectId(userId) })
      .populate(['actor', 'comment'])
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }

    return this.notificationModel
      .find({ recipient: new Types.ObjectId(userId), read: false })
      .populate(['actor', 'comment'])
      .sort({ createdAt: -1 });
  }

  async markAsRead(notificationId: string): Promise<Notification> {
    if (!Types.ObjectId.isValid(notificationId)) {
      throw new NotFoundException('Invalid notification ID');
    }

    const notification = await this.notificationModel.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification.populate(['recipient', 'actor', 'comment']);
  }

  async markAllAsRead(userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }

    await this.notificationModel.updateMany(
      { recipient: new Types.ObjectId(userId), read: false },
      { read: true }
    );
  }

  async deleteNotification(notificationId: string): Promise<void> {
    if (!Types.ObjectId.isValid(notificationId)) {
      throw new NotFoundException('Invalid notification ID');
    }

    const result = await this.notificationModel.deleteOne({ _id: notificationId });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Notification not found');
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }

    return this.notificationModel.countDocuments({
      recipient: new Types.ObjectId(userId),
      read: false,
    });
  }
}
