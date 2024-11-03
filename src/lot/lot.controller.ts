import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards  } from '@nestjs/common';
import { GetUser, Auth                  } from '../auth/decorators';
import { LotService                     } from './lot.service';
import { CreateLotDto                   } from './dto/create-lot.dto';
import { UpdateLotDto                   } from './dto/update-lot.dto';
import { Roles                          } from '../common';

@Controller('lot')
export class LotController {
  constructor(private readonly lotService: LotService) {}

  /* Crear un nuevo lote */
  @Auth()  
  @Post()
  async create(@Body() createLotDto: CreateLotDto, @GetUser('id') organizerId: string) {
      return await this.lotService.create(createLotDto, organizerId);
  }

  /* Obtener todos los lotes con paginación */
  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.lotService.findAll(page, limit);
  }

  /* Obtener un lote por su ID */
  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    const lot = await this.lotService.findOne(id);
    return lot;
  }

  /* Actualizar un lote */
  /*@Auth()
  @Patch(':id')
  //@RoleProtected(Roles.SUPERUSER)
  //@UseGuards(UserRoleGuard)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateLotDto: UpdateLotDto,
    @GetUser('id') userId: string,
    @GetUser('role') userRole: Roles) {
    return await this.lotService.update(id, updateLotDto, userId, userRole);
  }*/

  /* Eliminar un lote */
  /*@Delete(':id')
  @Auth()
  //@RoleProtected(Roles.AUCTIONEER, Roles.SUPERUSER)
  //@UseGuards(UserRoleGuard)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser('id') userId: string,
    @GetUser('role') userRole: Roles) {
    return await this.lotService.remove(id, userId, userRole);
  }*/
}
