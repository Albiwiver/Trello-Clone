import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  async createBoard(@Body() createBoardDto: CreateBoardDto) {
    return await this.boardsService.createBoard(createBoardDto);
  }

  @Get()
  async findAllBoards() {
    return await this.boardsService.findAllBoards();
  }

  @Get(':id')
  async findBoardById(@Param('id') id: string) {
    return await this.boardsService.findBoardById(id);
  }

  @Patch(':id')
  async updateBoard(@Param('id') id: string, @Body() dto: UpdateBoardDto) {
    return await this.boardsService.updateBoard(id, dto);
  }

  @Delete(':id')
  async removeBoardById(@Param('id') id: string) {
    return await(this.boardsService.removeBoardById(id), 'Board removed')
    
  }

  @Get(':id/full')
  getFullBoardsElements(@Param('id') id: string) {
    return this.boardsService.findFullBoardsElements(id);
  }
}
