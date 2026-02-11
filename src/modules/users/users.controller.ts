import { BadRequestException, Body, Controller, Get, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Request() req) {
    const id = req.user?.userId
    if (!id) {
      throw new BadRequestException('user id missing from token');
    }
    return this.usersService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('me')
  updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    const id = req.user?.userId
    if (!id) {
      throw new BadRequestException('user id missing from token');
    }
    
    return this.usersService.update(id, updateUserDto);
  }
}
