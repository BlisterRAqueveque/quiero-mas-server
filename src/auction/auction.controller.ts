import {  Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus, } from '@nestjs/common';
import { AuctionService   } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { Auth             } from '../auth/decorators';


@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  /* Todos los usuarios autenticados podrán crear subastas */
  /* TODO: restringir creación de subastas para usuarios, los usuarios comunes podrán crear subastas pero no de cualquier tipo ( Preguntar a Caro como manejar esto) */
@Auth()
  @Post()
  async create(@Body() createAuctionDto: CreateAuctionDto) {
    try {
      return await this.auctionService.create(createAuctionDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Obtener todas las subastas con paginación
  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    limit = Math.min(limit, 100); // Evitar que alguien solicite demasiados elementos
    return this.auctionService.findAll({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  // Obtener una subasta por su ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const auction = await this.auctionService.findOne(id);
    if (!auction) {
      throw new HttpException('Auction not found', HttpStatus.NOT_FOUND);
    }
    return auction;
  }

  /* TODO: El usuario que creó la subasta podrá actualizarla */ 
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
    try {
      return await this.auctionService.update(id, updateAuctionDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /* TODO: El usuario que creó la subasta podrá eliminarla, tambien el Superusuario y el Admin */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.auctionService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
