import { Controller, Get, Post, Body, Param, Query, ParseUUIDPipe, Delete, UseGuards } from '@nestjs/common';
import { GetUser, Auth, RoleProtected                  } from '../auth/decorators';
import { LotService                     } from './lot.service';
import { CreateLotDto                   } from './dto/create-lot.dto';
import { Roles } from '@prisma/client';
import { UserRoleGuard } from '../auth/guards/user-role.guard';

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
    return await this.lotService.findAll(page, limit);
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
  //@RoleProtected(Roles.SUPERUSER, ROLES.USER, ROLES.AUCTIONEER)
  //@UseGuards(UserRoleGuard)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateLotDto: UpdateLotDto,
    @GetUser('id') userId: string,
    @GetUser('role') userRole: Roles) {
    return await this.lotService.update(id, updateLotDto, userId, userRole);
  }*/

  /* Eliminar un lote */
  @Delete(':id')
  @Auth()
  @RoleProtected(Roles.ADMIN, Roles.SUPERUSER)
  @UseGuards(UserRoleGuard)
  async remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser('id') userId: string,
    @GetUser('role') userRole: Roles) {
    return await this.lotService.remove(id, userId, userRole);
  }
}
