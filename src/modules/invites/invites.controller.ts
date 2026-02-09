import { Controller, Post, Get, Body, Param, UseGuards, Request, Patch, Delete } from '@nestjs/common';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('invites')
@UseGuards(AuthGuard('jwt'))
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  create(@Request() req, @Body() dto: CreateInviteDto) {
    return this.invitesService.create(req.user.userId, dto);
  }

  @Get('inbox') // GET /invites/inbox
  getInbox(@Request() req) {
    return this.invitesService.getInbox(req.user.email);
  }

  @Patch(':id/accept')
  accept(@Request() req, @Param('id') id: string) {
    return this.invitesService.accept(req.user.userId, id);
  }

  @Delete(':id/reject')
  reject(@Request() req, @Param('id') id: string) {
    return this.invitesService.reject(req.user.userId, id);
  }
}
