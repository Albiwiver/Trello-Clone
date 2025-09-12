import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ColumnsService } from './columns.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';

@Controller('columns')
export class ColumnsController {
  constructor(private readonly columnsService: ColumnsService) {}

  @Post()
  async createColumn(@Body() createColumnDto: CreateColumnDto) {
    return await this.columnsService.createColumn(createColumnDto);
  }


  @Get(':id')
  async findColumnByBoardId(@Param('id') boardId: string) {
    return await this.columnsService.findColumnByBoardId(boardId);
  }

  @Patch(':id')
  async updateColumnById(@Param('id') id: string, @Body() updateColumnDto: UpdateColumnDto) {
    return await this.columnsService.updateColumnById(id, updateColumnDto);
  }

  @Delete(':id')
  async removeColumnById(@Param('id') id: string) {
    await this.columnsService.removeColumnById(id);
  }
}
