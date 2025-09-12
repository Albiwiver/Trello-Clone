// src/ws/board.gateway.ts
import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket,  
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinBoardDto } from './dto/join-board.dto';
import { LeaveBoardDto } from './dto/leave-board.dto';
;


@WebSocketGateway({
  cors: { origin: process.env.CORS_ORIGIN || 'http://localhost:4000' },
})

export class BoardGateway {
  @WebSocketServer() server: Server;

  
  @SubscribeMessage('joinBoard')
  join(@ConnectedSocket() socket: Socket, @MessageBody() dto: JoinBoardDto) {
    socket.join(`board:${dto.boardId}`);
  }

  
  @SubscribeMessage('leaveBoard')
  leave(@ConnectedSocket() socket: Socket, @MessageBody() dto: LeaveBoardDto) {
    socket.leave(`board:${dto.boardId}`);
  }

  
  emit(event: string, boardId: string, payload: unknown) {
    this.server.to(`board:${boardId}`).emit(event, payload);
  }
}
