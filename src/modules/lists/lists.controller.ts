import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ListsService } from './lists.service';

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

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    return this.listsService.update(id, req.user.userId, updateListDto as any);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.listsService.remove(id, req.user.userId);
  }
}