import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { WebsocketModule } from 'src/websocket/websocket.module';

@Module({
  controllers: [CardsController],
  providers: [CardsService],
  imports:[WebsocketModule]
  
})
export class CardsModule {}
