import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('lists')
@UseGuards(AuthGuard('jwt'))
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Post()
  create(@Request() req, @Body() createListDto: CreateListDto) {
    return this.listsService.create(req.user.userId, createListDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.listsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.listsService.findOne(id, req.user.userId);
  }
}