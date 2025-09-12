import { Module } from '@nestjs/common';
import { BoardGateway } from './websocket.gateway';

@Module({
  providers: [BoardGateway],
  exports:[BoardGateway]
})
export class WebsocketModule {}
