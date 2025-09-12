import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BoardsService } from 'src/boards/boards.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly boardsService: BoardsService
  ) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  findAllUsers() {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }


  @Get(':id/owned-boards')
  findOwnedBoards(@Param('id') id: string) {
    return (this.boardsService.findOwnedBoardsByUser(id), 'User removed')
  }

  

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  removeUser(@Param('id') id: string) {
    return this.usersService.removeUser(id);
  }
}
