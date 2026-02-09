import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('items')
@UseGuards(AuthGuard('jwt'))
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  create(@Request() req, @Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(req.user.userId, createItemDto);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, req.user.userId, updateItemDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.itemsService.remove(id, req.user.userId);
  }
}