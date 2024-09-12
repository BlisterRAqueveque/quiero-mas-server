import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from 'src/auth';
import { PaginationDto } from '../common';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly auth: AuthService,
  ) {}

  @Post('auth/login')
  login(@Body() login: LoginDto) {
    return this.usersService.login(login);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.usersService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('auth/confirm')
  async confirmMail(
    @Headers('authorization') token: string,
    @Res() res: Response,
  ) {
    const split = token.split('Bearer ')[1];
    const isToken = this.auth.isJwt(split);
    if (isToken) {
      const decoded = await this.auth.verifyJwt(split);

      const user = await this.usersService.findOne(decoded.sub);

      if (user.verified) throw new BadRequestException('User already verified');

      const result = await this.usersService.update(decoded.sub, {
        verified: true,
        id: '',
      });
      res.status(HttpStatus.OK).json({ ok: true, result, msg: 'Verified' });
    } else {
      throw new BadRequestException('Token no valid');
    }
  }
}
