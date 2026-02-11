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
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class ListGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    const token = client.handshake.headers.cookie;
    if (!token) {
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
    // In production validate userId against token
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