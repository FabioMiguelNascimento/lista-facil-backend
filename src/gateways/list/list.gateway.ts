import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL!,
    credentials: true,
  },
})
export class ListGateway implements OnGatewayConnection {
  private readonly logger = new Logger(ListGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const cookieHeader = client.handshake.headers.cookie as string | undefined;
    if (!cookieHeader) {
      this.logger.warn('Socket connection rejected: missing cookie header');
      client.disconnect();
      return;
    }

    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const idx = c.indexOf('=');
        const key = c.slice(0, idx).trim();
        const val = c.slice(idx + 1).trim();
        return [key, val];
      }),
    );

    const token = cookies['access_token'];
    if (!token) {
      this.logger.warn('Socket connection rejected: access_token cookie missing');
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token);
      client.data.user = { userId: payload.sub?.toString(), email: payload.email };
      this.logger.verbose(`Socket connected for user ${client.data.user.userId}`);
    } catch (err) {
      this.logger.warn(`Socket auth failed: ${(err as Error).message}`);
      client.emit('unauthorized', { message: 'Unauthorized' });
      client.disconnect();
      return;
    }
  }

  @SubscribeMessage('join_list')
  handleJoinList(
    @MessageBody() data: { listId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`list_${data.listId}`);
  }

  @SubscribeMessage('item_toggled')
  handleItemToggled(
    @MessageBody() data: { listId: string; itemId: string; checked: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`list_${data.listId}`).emit('item_updated', data);
  }

  @SubscribeMessage('identify')
  handleIdentify(@MessageBody() data: { userId: string }, @ConnectedSocket() client: Socket) {
    const socketUserId = client.data.user?.userId;

    if (!socketUserId) {
      client.emit('unauthorized', { message: 'Unauthorized' });
      client.disconnect();
      return;
    }

    if (socketUserId.toString() !== data.userId?.toString()) {
      this.logger.warn(`Socket identify mismatch: token user ${socketUserId} !== payload ${data.userId}`);
      client.emit('unauthorized', { message: 'Unauthorized' });
      client.disconnect();
      return;
    }

    client.join(`user_${data.userId}`);
  }

  sendListUpdate(listId: string, event: string, payload: any) {
    if (!this.server) return;
    this.server.to(`list_${listId}`).emit(event, payload);
  }

  notifyUser(userId: string, event: string, payload: any) {
    if (!this.server) return;
    this.server.to(`user_${userId}`).emit(event, payload);
  }
}