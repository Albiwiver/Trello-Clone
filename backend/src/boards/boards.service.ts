import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BoardsService {

  constructor(private readonly prismaService: PrismaService){}
  
  
async createBoard({ title, ownerId, description }: CreateBoardDto) {
  return this.prismaService.$transaction(async (tx) => {
    
    const board = await tx.board.create({
      data: { title, ownerId, ...(description !== undefined && { description }) },
      select: { id: true, title: true, ownerId: true, description: true },
    });
  
    await tx.column.createMany({
      data: [
        { boardId: board.id, title: 'To Do',  order: 1 },
        { boardId: board.id, title: 'Pending', order: 2 }, 
        { boardId: board.id, title: 'Done',   order: 3 },
      ],
    });
    
    const full = await tx.board.findUnique({
      where: { id: board.id },
      select: {
        id: true, title: true, ownerId: true, description: true,
        columns: { orderBy: { order: 'asc' }, select: { id: true, title: true, order: true } },
      },
    });

    return full!;
  });
}


  async findAllBoards() {
    const boards = this.prismaService.board.findMany({
      select: {id: true, title: true, description: true, ownerId: true}
    })
    if(!boards)
      throw new NotFoundException('No boards found')
    return boards
  }

  async findBoardById(id: string) {
    try {
      const board = await this.prismaService.board.findUnique({
        where:{id},
        select: {title:true, ownerId:true, description:true, id:true}
      })
      return board
      
    } catch (error) {
      throw new NotFoundException(`Board with ${id} not found`)
      
    }
  }


  async findOwnedBoardsByUser(userId: string) {

    try {
      const boardByUser = await this.prismaService.board.findMany({
        where:{ownerId: userId},
        select:{id: true, title: true, description: true}
      })
      return boardByUser
      
    } catch (error) {
      throw new NotFoundException(`UserBoards with ${userId} were not found`)

    }
    
  }
  
  
  

  async updateBoard(id: string, dto: UpdateBoardDto = {} as UpdateBoardDto) {
    const {title, description} = dto

    const data: any = {
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
  };
  if (Object.keys(data).length === 0) {
    const current = await this.prismaService.board.findUnique({
      where: { id },
      select: { id: true, title: true, description: true, ownerId: true },
    });
    if (!current) throw new NotFoundException('Board not found');
    return current; 
  }

    try {
      return await this.prismaService.board.update({
        where: { id },
        data,
        select: { id: true, title: true, description: true, ownerId: true },
      });
    } catch {
      throw new NotFoundException('Board not found');
    }

  }


  

  async removeBoardById(id: string) {
    const exists = await this.prismaService.board.findUnique({ where: { id }, select: { id: true } });
    if (!exists) throw new NotFoundException(`Board with ${id} not found`);

    const columnIds = (await this.prismaService.column.findMany({
      where: { boardId: id }, select: { id: true },
    })).map(column => column.id);

  await this.prismaService.$transaction([
    this.prismaService.card.deleteMany({ where: { columnId: { in: columnIds } } }),
    this.prismaService.column.deleteMany({ where: { boardId: id } }),
    this.prismaService.board.delete({ where: { id } }),
  ]);
  }


  async findFullBoardsElements(id: string) {
    const board = await this.prismaService.board.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        ownerId: true,
        
        columns: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            title: true,
            order: true,
            cards: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                content: true,   
                order: true,
                columnId: true,
              },
            },
          },
        },
      },
    });

    if (!board) throw new NotFoundException('Board not found');
    return board; 
  }
  
  
  
}
