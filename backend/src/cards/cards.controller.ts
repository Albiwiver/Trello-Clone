import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { MoveCardDto } from './dto/move-card.dto';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  async createCard(@Body() createCardDto: CreateCardDto) {
    return this.cardsService.createCard(createCardDto);
  }

  

  @Get(':id')
  async findCardByColumn(@Param('id') id: string) {
    return this.cardsService.findCardByColumn(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.updateCard(id, updateCardDto);
  }

  @Delete(':id')
  removeCardByColumnId(@Param('id') id: string) {
    return this.cardsService.removeCardById(id);
  }


  @Patch(':id/move')
  moveCard(@Param('id') id: string, @Body() dto: MoveCardDto) {
    return this.cardsService.moveCard(id, dto);
  }

  @Patch(':id/move')
  move(@Param('id') id: string, @Body() dto: MoveCardDto) {
    return this.cardsService.moveCard(id, dto);
  }
}
