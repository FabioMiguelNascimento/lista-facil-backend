import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateListDto } from './dto/create-list.dto';

@Injectable()
export class ListsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createListDto: CreateListDto) {
    return this.prisma.list.create({
      data: {
        title: createListDto.title,
        members: {
          create: { userId },
        },
      },
      include: { members: true },
    });
  }

  async findAll(userId: string) {
    return this.prisma.list.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        _count: { select: { items: true, members: true } },
      },
    });
  }

  async findOne(id: string, userId: string) {
    const list = await this.prisma.list.findUnique({
      where: { id },
      include: { 
        items: { orderBy: { createdAt: 'asc' } },
        members: { include: { user: { select: { email: true, id: true } } } } 
      },
    });

    if (!list) throw new NotFoundException('Lista não encontrada');

    const isMember = list.members.some((member) => member.userId === userId);
    if (!isMember) throw new ForbiddenException('Você não tem acesso a esta lista');

    return list;
  }
}