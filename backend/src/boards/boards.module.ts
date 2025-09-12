import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { ColumnsModule } from 'src/columns/columns.module';

@Module({
  controllers: [BoardsController],
  providers: [BoardsService],
  exports: [BoardsService],
  
})
export class BoardsModule {}
