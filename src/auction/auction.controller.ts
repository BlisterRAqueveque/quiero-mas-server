import {  Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { AuctionService   } from './auction.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { Auth, GetUser    } from '../auth/decorators';
import { State            } from '../common/enums/state.enum';


@Controller('auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  /* Todos los usuarios autenticados podrán crear subastas */
  /* TODO: restringir creación de subastas para usuarios, los usuarios comunes podrán crear subastas pero no de cualquier tipo ( Preguntar a Caro como manejar esto) */
  @Auth()
  @Post()
  async create(@Body() createAuctionDto: CreateAuctionDto, @GetUser('id') organizerId: string) {  /* Extraermos el id del usuario desde el decorador @GetUser, así simplificamos la lógica */
    try {
      return await this.auctionService.create(createAuctionDto, organizerId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }


  /* Obtener todas las subastas según su estado, si no es proporcionado el estado devolvemos todas las Auctions. Tambien implementamos paginación */ 
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('state') state?: State,
  ) {
    return this.auctionService.findAll(page, limit, state); /* Llama al servicio para obtener las subastas con la lógica de paginación y filtrado por estado */
  }


  /* Obtener una subasta por su ID */ 
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.auctionService.findOne(id);
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

