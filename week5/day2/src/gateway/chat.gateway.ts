import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { CommentsService } from '../comments/comments.service';
import { LikesService } from '../likes/likes.service';
import { UsersService } from '../users/users.service';
import { CreateNotificationDto } from '../notifications/dtos/create-notification.dto';
import { NotificationType } from '../notifications/schemas/notification.schema';

// Store user socket mappings
const userSockets: Map<string, string> = new Map();

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
@Injectable()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly commentsService: CommentsService,
    private readonly likesService: LikesService,
    private readonly usersService: UsersService,
  ) {}

  afterInit(server: Server) {
    console.log('WebSocket initialized');
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Remove user from mapping
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === client.id) {
        userSockets.delete(userId);
        break;
      }
    }
  }

  @SubscribeMessage('join')
  handleJoin(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
    userSockets.set(data.userId, client.id);
    client.join(`user-${data.userId}`);
    console.log(`User ${data.userId} joined. Socket: ${client.id}`);
    this.server.emit('user-online', { userId: data.userId });
  }

  @SubscribeMessage('leave')
  handleLeave(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
    userSockets.delete(data.userId);
    client.leave(`user-${data.userId}`);
    console.log(`User ${data.userId} left`);
    this.server.emit('user-offline', { userId: data.userId });
  }

  // Emit new comment to all connected users
  async emitNewComment(commentData: any, authorInfo: any) {
    this.server.emit('comment-added', {
      comment: commentData,
      author: authorInfo,
      timestamp: new Date(),
    });
  }

  // Emit new reply to the original comment author
  async emitReplyNotification(commentId: string, replyData: any, originalAuthorId: string) {
    const userSocketId = userSockets.get(originalAuthorId);
    if (userSocketId) {
      this.server.to(`user-${originalAuthorId}`).emit('new-reply', {
        commentId,
        reply: replyData,
        timestamp: new Date(),
      });
    }
  }

  // Emit like notification to comment author
  async emitLikeNotification(commentId: string, likerInfo: any, commentAuthorId: string) {
    const userSocketId = userSockets.get(commentAuthorId);
    if (userSocketId) {
      this.server.to(`user-${commentAuthorId}`).emit('comment-liked', {
        commentId,
        liker: likerInfo,
        timestamp: new Date(),
      });
    }
  }

  // Emit follow notification
  async emitFollowNotification(followerId: string, followerInfo: any, targetUserId: string) {
    const userSocketId = userSockets.get(targetUserId);
    if (userSocketId) {
      this.server.to(`user-${targetUserId}`).emit('new-follower', {
        follower: followerInfo,
        timestamp: new Date(),
      });
    }
  }

  // Handle new comment with notification
  @SubscribeMessage('create-comment')
  async handleCreateComment(
    @MessageBody() data: { userId: string; content: string; parentCommentId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const comment = await this.commentsService.create(
        {
          content: data.content,
          parentCommentId: data.parentCommentId,
        },
        data.userId,
      );

      const author = await this.usersService.findById(data.userId);

      // If it's a reply, notify only the parent comment author
      if (data.parentCommentId) {
        const parentComment = await this.commentsService.findById(data.parentCommentId);
        const parentAuthorId = (parentComment.author as any)._id.toString();

        // Send notification only to parent comment author
        await this.notificationsService.create({
          recipient: parentAuthorId,
          actor: data.userId,
          type: NotificationType.REPLY,
          comment: comment._id.toString(),
          message: `${author.username} replied to your comment`,
        } as CreateNotificationDto);

        // Emit via WebSocket
        await this.emitReplyNotification(data.parentCommentId, comment, parentAuthorId);
      } else {
        // If it's a top-level comment, notify all users
        const allUsers = await this.usersService.getAllUsers();
        for (const user of allUsers) {
          if (user._id.toString() !== data.userId) {
            await this.notificationsService.create({
              recipient: user._id.toString(),
              actor: data.userId,
              type: NotificationType.COMMENT,
              comment: comment._id.toString(),
              message: `${author.username} posted a new comment`,
            } as CreateNotificationDto);
          }
        }

        // Emit via WebSocket
        await this.emitNewComment(comment, author);
      }

      client.emit('comment-created', {
        success: true,
        comment,
      });
    } catch (error) {
      client.emit('comment-error', {
        success: false,
        message: error.message,
      });
    }
  }

  // Handle like with notification
  @SubscribeMessage('like-comment')
  async handleLikeComment(
    @MessageBody() data: { userId: string; commentId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const result = await this.likesService.likeComment(data.commentId, data.userId);
      const comment = result.comment;
      const liker = await this.usersService.findById(data.userId);
      const commentAuthorId = (comment.author as any)._id.toString();

      // Send notification only to comment author
      if (commentAuthorId !== data.userId) {
        await this.notificationsService.create({
          recipient: commentAuthorId,
          actor: data.userId,
          type: NotificationType.LIKE,
          comment: data.commentId,
          message: `${liker.username} liked your comment`,
        } as CreateNotificationDto);

        // Emit via WebSocket
        await this.emitLikeNotification(data.commentId, liker, commentAuthorId);
      }

      client.emit('like-success', {
        success: true,
        comment: result.comment,
      });
    } catch (error) {
      client.emit('like-error', {
        success: false,
        message: error.message,
      });
    }
  }

  // Handle unlike
  @SubscribeMessage('unlike-comment')
  async handleUnlikeComment(
    @MessageBody() data: { userId: string; commentId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const result = await this.likesService.unlikeComment(data.commentId, data.userId);
      const comment = result.comment;

      client.emit('unlike-success', {
        success: true,
        comment,
      });
    } catch (error) {
      client.emit('unlike-error', {
        success: false,
        message: error.message,
      });
    }
  }

  // Handle follow with notification
  @SubscribeMessage('follow-user')
  async handleFollowUser(
    @MessageBody() data: { userId: string; targetUserId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const result = await this.usersService.follow(data.userId, data.targetUserId);
      const follower = result.follower;

      // Send notification to followed user
      await this.notificationsService.create({
        recipient: data.targetUserId,
        actor: data.userId,
        type: NotificationType.FOLLOW,
        message: `${follower.username} started following you`,
      } as CreateNotificationDto);

      // Emit via WebSocket
      await this.emitFollowNotification(data.userId, follower, data.targetUserId);

      client.emit('follow-success', {
        success: true,
        result,
      });
    } catch (error) {
      client.emit('follow-error', {
        success: false,
        message: error.message,
      });
    }
  }

  // Handle unfollow
  @SubscribeMessage('unfollow-user')
  async handleUnfollowUser(
    @MessageBody() data: { userId: string; targetUserId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const result = await this.usersService.unfollow(data.userId, data.targetUserId);

      client.emit('unfollow-success', {
        success: true,
        result,
      });
    } catch (error) {
      client.emit('unfollow-error', {
        success: false,
        message: error.message,
      });
    }
  }

  // Get online users
  @SubscribeMessage('get-online-users')
  handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
    const onlineUsers = Array.from(userSockets.keys());
    client.emit('online-users', { users: onlineUsers });
  }
}
