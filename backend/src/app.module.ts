import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { ColumnsModule } from './columns/columns.module';
import { CardsModule } from './cards/cards.module';
import { WebsocketModule } from './websocket/websocket.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [UsersModule, BoardsModule, ColumnsModule, CardsModule, WebsocketModule, ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: '.env'
  }), PrismaModule, AuthModule, WebsocketModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
