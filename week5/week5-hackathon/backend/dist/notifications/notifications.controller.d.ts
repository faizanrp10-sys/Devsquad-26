import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getNotifications(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/notification.schema").NotificationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/notification.schema").Notification & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    markAllAsRead(req: any): Promise<import("mongoose").UpdateWriteOpResult>;
    markAsRead(req: any, id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/notification.schema").NotificationDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/notification.schema").Notification & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    clearAll(req: any): Promise<import("mongodb").DeleteResult>;
}
