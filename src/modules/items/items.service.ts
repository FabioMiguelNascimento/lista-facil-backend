import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ListGateway } from '../../gateways/list/list.gateway';
import { CreateItemDto } from './dto/create-item.dto'; // DTO: content, listId
import { UpdateItemDto } from './dto/update-item.dto'; // DTO: checked, content

@Injectable()
export class ItemsService {
  constructor(
    private prisma: PrismaService,
    private listGateway: ListGateway,
  ) {}

  // Helper privado para verificar permissão
  private async validateAccess(listId: string, userId: string) {
    const isMember = await this.prisma.listMember.findUnique({
      where: {
        userId_listId: { userId, listId },
      },
    });
    if (!isMember) throw new ForbiddenException('Sem acesso a esta lista.');
  }

  async create(userId: string, createItemDto: CreateItemDto) {
    await this.validateAccess(createItemDto.listId, userId);

    const newItem = await this.prisma.item.create({
      data: {
        content: createItemDto.content,
        listId: createItemDto.listId,
      },
    });

    // Notifica via WebSocket: "Alguém adicionou um item!"
    this.listGateway.sendListUpdate(createItemDto.listId, 'item_created', newItem);

    return newItem;
  }

  async update(id: string, userId: string, updateItemDto: UpdateItemDto) {
    // 1. Busca o item para saber de qual lista ele é
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Item não encontrado');

    // 2. Valida acesso à lista
    await this.validateAccess(item.listId, userId);

    // 3. Atualiza
    const updatedItem = await this.prisma.item.update({
      where: { id },
      data: updateItemDto,
    });

    // Notifica via WebSocket: "Alguém riscou/editou um item!"
    this.listGateway.sendListUpdate(item.listId, 'item_updated', updatedItem);

    return updatedItem;
  }

  async remove(id: string, userId: string) {
    const item = await this.prisma.item.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Item não encontrado');

    await this.validateAccess(item.listId, userId);

    await this.prisma.item.delete({ where: { id } });

    // Notifica via WebSocket: "Alguém removeu um item!"
    this.listGateway.sendListUpdate(item.listId, 'item_deleted', { id });

    return { message: 'Item removido' };
  }
}   