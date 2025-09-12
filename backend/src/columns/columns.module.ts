import { Module } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { ColumnsController } from './columns.controller';
import { WebsocketModule } from 'src/websocket/websocket.module';

@Module({
  controllers: [ColumnsController],
  providers: [ColumnsService],
  exports: [ColumnsService],
  imports:[WebsocketModule]
})
export class ColumnsModule {}
