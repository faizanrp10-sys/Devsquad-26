import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(userId: string, message: string, type: string, carId?: string) {
    const newNotification = new this.notificationModel({
      userId,
      message,
      type,
      carId,
    });
    return newNotification.save();
  }

  async findAllByUser(userId: string) {
    return this.notificationModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel
      .updateMany({ userId, isRead: false }, { isRead: true })
      .exec();
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.notificationModel
      .findOneAndUpdate({ _id: notificationId, userId }, { isRead: true }, { new: true })
      .exec();
  }

  async clearAll(userId: string) {
    return this.notificationModel.deleteMany({ userId }).exec();
  }
}
