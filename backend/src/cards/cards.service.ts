import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MoveCardDto } from './dto/move-card.dto';
import { BoardGateway } from 'src/websocket/websocket.gateway';


const CARD_SELECT = { id: true, title: true, content: true, order: true, columnId: true };


@Injectable()
export class CardsService {

  constructor(
    private readonly prismaService: PrismaService,
    private readonly gateWay: BoardGateway
  ){}
  
  async createCard({title, columnId, content}: CreateCardDto) {
    const columnExists = await this.prismaService.column.findUnique({
      where: {id:columnId},
      select: {id: true}
    })
    if(!columnExists) throw new NotFoundException(`Column with ${columnId} not found`)

    const order = await (this.prismaService.card.count({where:{columnId}})) + 1  

    const card = await this.prismaService.card.create({
      data: {title: title.trim(), columnId, order, ...(content && {content})},
      select: {id:true, title: true, columnId:true, order: true, content:true} 
    })
    const {boardId} = await this.prismaService.column.findUniqueOrThrow({
      where:{id:card.columnId},
      select: {boardId:true}
    })
    this.gateWay.emit('card.created',boardId, {card, boardId} )
    
      
      
  }


  async findCardByColumn(columnId: string) {
  return this.prismaService.card.findMany({
    where: { columnId },
    select: { id: true, title: true, content: true, order: true },
    orderBy: { order: 'asc' },
  });
}

  async updateCard(id: string, dto: UpdateCardDto = {} as UpdateCardDto) {
  const current = await this.prismaService.card.findUnique({ where: { id }, select: { id: true } });
  if (!current) throw new NotFoundException('Card not found');

  const { title, content } = dto;
  const data: any = {
    ...(title !== undefined && { title: title.trim() }),
    ...(content !== undefined && { content }),
  };
  if (Object.keys(data).length === 0) {
    return this.prismaService.card.findUnique({
      where: { id }, select: { id: true, title: true, content: true, order: true, columnId: true },
    });
  }
  const card = await this.prismaService.card.update({
    where: { id }, data,
    select: { id: true, title: true, content: true, order: true, columnId: true },
  });
  const {boardId} = await this.prismaService.column.findFirstOrThrow({
    where: {id:card.columnId },
    select: {boardId:true}
  })
  this.gateWay.emit('card.updated', boardId, {card, boardId})
}






  async removeCardById(id: string): Promise<void> {
  const card = await this.prismaService.card.findUnique({
    where: { id }, select: { id: true, columnId: true, order: true },
  });
  if (!card) throw new NotFoundException('Card not found');

  await this.prismaService.$transaction([
    this.prismaService.card.delete({ where: { id } }),
    this.prismaService.card.updateMany({
      where: { columnId: card.columnId, order: { gt: card.order } },
      data: { order: { decrement: 1 } },
    }),
  ]);
  const { boardId } = await this.prismaService.column.findUniqueOrThrow({
  where: { id: card.columnId }, select: { boardId: true },
});
  this.gateWay.emit('card.deleted', boardId, {
  cardId: card.id, columnId: card.columnId, boardId,
});
}






async moveCard(id: string, { toColumnId, toOrder }: MoveCardDto) {
  const card = await this.prismaService.card.findUnique({
    where: { id },
    select: { id: true, title: true, content: true, order: true, columnId: true }
  });
  if (!card) throw new NotFoundException('Card not found');

  const srcCol = card.columnId;
  const dstCol = toColumnId ?? srcCol;
  const sameCol = dstCol === srcCol;

  if (!sameCol) {
    const exists = await this.prismaService.column.findUnique({
      where: { id: dstCol }, select: { id: true },
    });
    if (!exists) throw new NotFoundException('Destination column not found');
  }

  // Normalizar destino
  const dstCount = await this.prismaService.card.count({ where: { columnId: dstCol } });
  let target = toOrder ?? (sameCol ? card.order : dstCount + 1);
  const max = sameCol ? dstCount : dstCount + 1;
  if (target < 1) target = 1;
  if (target > max) target = max;

  if (sameCol && target === card.order) return card;

  const SHIFT = 1_000_000;

  const moved = await this.prismaService.$transaction(async (tx) => {
    if (sameCol) {
      // REORDENAR EN LA MISMA COLUMNA (sin colisiones)
      if (target < card.order) {
        // Sube: [target .. current-1] ↑SHIFT, fija card, baja bloque ⇒ neto +1
        await tx.card.updateMany({
          where: { columnId: srcCol, order: { gte: target, lt: card.order } },
          data: { order: { increment: SHIFT } },
        });
        const updated = await tx.card.update({
          where: { id: card.id },
          data: { order: target },
          select: CARD_SELECT,
        });
        await tx.card.updateMany({
          where: { columnId: srcCol, order: { gte: target + SHIFT, lt: card.order + SHIFT } },
          data: { order: { decrement: SHIFT - 1 } }, // (x+SHIFT) - (SHIFT-1) = x+1
        });
        return updated;
      } else {
        // Baja: (current .. target] ↑SHIFT, fija card, baja bloque ⇒ neto -1
        await tx.card.updateMany({
          where: { columnId: srcCol, order: { lte: target, gt: card.order } },
          data: { order: { increment: SHIFT } },
        });
        const updated = await tx.card.update({
          where: { id: card.id },
          data: { order: target },
          select: { id: true, title: true, content: true, order: true, columnId: true }
        });
        await tx.card.updateMany({
          where: { columnId: srcCol, order: { lte: target + SHIFT, gt: card.order + SHIFT } },
          data: { order: { decrement: SHIFT + 1 } }, // (x+SHIFT) - (SHIFT+1) = x-1
        });
        return updated;
      }
    }

    // CAMBIAR DE COLUMNA (abrir hueco destino + compactar origen sin colisiones)
    // 1) Abrir hueco en destino
    await tx.card.updateMany({
      where: { columnId: dstCol, order: { gte: target } },
      data: { order: { increment: SHIFT } },
    });

    // 2) Mover la card
    const moved = await tx.card.update({
      where: { id: card.id },
      data: { columnId: dstCol, order: target },
      select: CARD_SELECT,
    });

    // 3) Normalizar destino: (>= target+SHIFT) ⇒ - (SHIFT-1)  ⇒ neto +1
    await tx.card.updateMany({
      where: { columnId: dstCol, order: { gte: target + SHIFT } },
      data: { order: { decrement: SHIFT - 1 } },
    });

    // 4) Compactar origen con SHIFT para evitar P2002
    await tx.card.updateMany({
      where: { columnId: srcCol, order: { gt: card.order } },
      data: { order: { increment: SHIFT } },
    });
    await tx.card.updateMany({
      where: { columnId: srcCol, order: { gt: card.order + SHIFT } },
      data: { order: { decrement: SHIFT + 1 } }, // (x+SHIFT) - (SHIFT+1) = x-1
    });
    const { boardId } = await this.prismaService.column.findUniqueOrThrow({
      where: { id: moved.columnId }, select: { boardId: true },
    });
    this.gateWay.emit('card.moved', boardId, {
      cardId: moved.id,
      fromColumnId: srcCol,
      toColumnId: moved.columnId,
      toOrder: moved.order,
      boardId,
});

    
  });
  return moved;
}


}
