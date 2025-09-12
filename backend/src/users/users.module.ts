import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { BoardsService } from 'src/boards/boards.service';
import { BoardsModule } from 'src/boards/boards.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [BoardsModule]
})
export class UsersModule {}
