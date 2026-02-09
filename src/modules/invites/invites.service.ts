import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ListGateway } from '../../gateways/list/list.gateway';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateInviteDto } from './dto/create-invite.dto';

@Injectable()
export class InvitesService {
  constructor(
    private prisma: PrismaService,
    private listGateway: ListGateway,
  ) {}

  async create(userId: string, dto: CreateInviteDto) {
    const requesterIsMember = await this.prisma.listMember.findUnique({
      where: { userId_listId: { userId, listId: dto.listId } },
      include: { list: true },
    });
    if (!requesterIsMember) throw new ForbiddenException('Você não tem permissão nesta lista.');

    const invitedUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!invitedUser) throw new NotFoundException('Usuário não encontrado.');

    const isAlreadyMember = await this.prisma.listMember.findUnique({
      where: { userId_listId: { userId: invitedUser.id, listId: dto.listId } },
    });
    if (isAlreadyMember) throw new ConflictException('Usuário já é membro da lista.');

    const invite = await this.prisma.invite.create({
      data: {
        email: dto.email,
        listId: dto.listId,
        inviterId: userId,
      },
    });

    this.listGateway.notifyUser(invitedUser.id, 'new_invite', {
      inviteId: invite.id,
      listTitle: requesterIsMember.list.title,
      inviterId: userId,
    });

    return invite;
  }

  async getInbox(userEmail: string) {
    return this.prisma.invite.findMany({
      where: { email: userEmail },
      include: {
        list: { select: { title: true } },
        inviter: { select: { email: true } },
      },
    });
  }

  async accept(userId: string, inviteId: string) {
    const invite = await this.prisma.invite.findUnique({ where: { id: inviteId } });
    if (!invite) throw new NotFoundException('Convite não encontrado.');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    if (invite.email !== user.email) throw new ForbiddenException('Este convite não é para você.');

    const [member] = await this.prisma.$transaction([
      this.prisma.listMember.create({ data: { userId, listId: invite.listId } }),
      this.prisma.invite.delete({ where: { id: inviteId } }),
    ]);

    this.listGateway.sendListUpdate(invite.listId, 'member_added', { userId });

    return member;
  }

  async reject(userId: string, inviteId: string) {
    const invite = await this.prisma.invite.findUnique({ where: { id: inviteId } });
    if (!invite) throw new NotFoundException('Convite não encontrado.');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');

    if (invite.email !== user.email) throw new ForbiddenException('Este convite não é para você.');

    return this.prisma.invite.delete({ where: { id: inviteId } });
  }
}
