import {  Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { AuctionService   } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { Auth, GetUser, RoleProtected    } from '../auth/decorators';
import { ParseUUIDPipe    } from '@nestjs/common';
import { Roles } from '../common';
import { UserRoleGuard } from '../auth/guards/user-role.guard';
import { State } from '@prisma/client';

/* Implemenatar a futuro poder pausar una subasta */
@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  /* Todos los usuarios autenticados podrán crear subastas */
  /* TODO: restringir creación de subastas para usuarios, los usuarios comunes podrán crear subastas pero no de cualquier tipo ( Preguntar a Caro como manejar esto) */
  @Auth()
  @Post()
  async create(@Body() createAuctionDto: CreateAuctionDto, @GetUser('id') organizerId: string) {  /* Extraermos el id del usuario desde el decorador @GetUser, así simplificamos la lógica */
      return await this.auctionService.create(createAuctionDto, organizerId);
  }

  /* Obtener todas las subastas según su estado, si no es proporcionado el estado devolvemos todas las Auctions. También implementamos paginación */ 
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('state') state?: State,
    
  ) {
    return await this.auctionService.findAll(page, limit, state); /* Llama al servicio para obtener las subastas con la lógica de paginación y filtrado por estado */
  }

  /* Obtener una subasta por su ID */ 
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const auction = await this.auctionService.findOne(id);
    return auction;
  }

  /* El usuario que creó la subasta podrá actualizarla */ 
  @Auth()
  @UseGuards(UserRoleGuard)
  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() updateAuctionDto: UpdateAuctionDto,
    @GetUser('id') userId: string ) {
    return await this.auctionService.update(id, updateAuctionDto, userId)
  }

  /* TODO: El usuario que creó la subasta podrá eliminarla, también el Superusuario y el Admin */
  @Delete(':id')
  @Auth()
  @RoleProtected(Roles.AUCTIONEER, Roles.SUPERUSER)
  @UseGuards(UserRoleGuard)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser('id') userId: string,
    @GetUser('role') userRole: Roles){
   
    return await this.auctionService.remove(id, userId, userRole);
  }
  
}

