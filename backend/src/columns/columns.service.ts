import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateColumnDto } from './dto/create-column.dto';
import { UpdateColumnDto } from './dto/update-column.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BoardGateway } from 'src/websocket/websocket.gateway';

@Injectable()
export class ColumnsService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly gateway: BoardGateway
  ){}
  
  
  async createColumn({title, boardId}: CreateColumnDto) {
    const boardExists = await this.prismaService.board.findUnique({
      where: {id: boardId},
      select: {id: true}
    })
    if(!boardExists) throw new NotFoundException(`Board with ${boardId} not found`)
    
    const order = (await this.prismaService.column.count({where:{boardId}})) + 1
    
    const column = await this.prismaService.column.create({
      data: {title, boardId, order},
      select: {id: true, title: true, order:true, boardId: true}
    })
    this.gateway.emit('column.created', boardId,{boardId,column})
    return column
    

      
  }


  async findColumnByBoardId(boardId: string) {
  const board = await this.prismaService.board.findUnique({
    where: { id: boardId },
    select: { id: true },
  });
  if (!board) throw new NotFoundException(`Board "${boardId}" not found`);

  return this.prismaService.column.findMany({
    where: { boardId },
    select: { id: true, title: true, order: true },
    orderBy: { order: 'asc' },
  }); 

}


  async updateColumnById(id: string, dto: UpdateColumnDto = {} as UpdateColumnDto) {
  const current = await this.prismaService.column.findUnique({ where: { id }, select: { id: true } });
  if (!current) throw new NotFoundException('Column not found');

  const { title } = dto;
  const data: any = {
    ...(title !== undefined && { title }),
  };

  if (Object.keys(data).length === 0) {
    return this.prismaService.column.findUnique({
      where: { id },
      select: { id: true, title: true, order: true, boardId: true },
    });
  }

  const updated = await this.prismaService.column.update({
    where: { id },
    data,
    select: { id: true, title: true, order: true, boardId: true },
  });
  this.gateway.emit('column.updated', updated.boardId, {boardId:updated.boardId, column:updated})
}

  async removeColumnById(id: string) {
    const columnToDelete = await this.prismaService.column.findUnique({
      where:{id},
      select:{id:true, boardId: true, order: true }
    })
    if(!columnToDelete) throw new NotFoundException(`Column with ${id} not found`)

    await this.prismaService.$transaction([
      this.prismaService.card.deleteMany({where: {columnId: id}}),
      this.prismaService.column.delete({where:{id}}),
      this.prismaService.column.updateMany({
        where: {boardId: columnToDelete.boardId, order: {gt: columnToDelete.order}},
        data: {order:{decrement:1}}
      })
    ])
    this.gateway.emit('column.deleted', columnToDelete.boardId, {boardId:columnToDelete.boardId, columnId: columnToDelete.id})

    
  }
}
