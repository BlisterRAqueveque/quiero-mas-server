import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Roles          } from '../common';
import { PrismaService  } from '../prisma-setup/prisma.service';
import { CreateLotDto   } from './dto/create-lot.dto';
import { UpdateLotDto   } from './dto/update-lot.dto';



@Injectable()
export class LotService {
  constructor(private readonly prisma: PrismaService) {}

  /* Crear un nuevo lote */
  async create(createLotDto: CreateLotDto, organizerId: string) {
     // Verifica que el usuario autenticado sea el creador de la subasta
     const auction = await this.prisma.auction.findUnique({
      where: { id: createLotDto.auctionId },
  });

  if (!auction) {
      throw new Error("Subasta no encontrada");
  }

  if (auction.organizerId !== organizerId) {
      throw new Error("No tienes permiso para agregar lotes a esta subasta");
  }

  // Si la verificación pasa, crea el lote
  return this.prisma.lot.create({
      data: {
          ...createLotDto,
          createdAt: createLotDto.createdAt || new Date(),
          auctionId: createLotDto.auctionId,
      },
  });
  }

  /* Obtener todos los lotes con paginación */
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const maxLimit = 100;
    const adjustedLimit = Math.min(limit, maxLimit);

    try {
      const [data, total] = await Promise.all([
        this.prisma.lot.findMany({
          skip,
          take: adjustedLimit,
        }),
        this.prisma.lot.count(),
      ]);

      const totalPages = Math.ceil(total / adjustedLimit);

      return {
        data,
        total,
        totalPages,
        currentPage: page,
        perPage: adjustedLimit,
      };
    } catch (error) {
      throw new HttpException(
        'Error retrieving lots, please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* Obtener un lote por su ID */
  async findOne(id: string) {
    try {
      const lot = await this.prisma.lot.findUnique({
        where: { id },
        include: { auction: true, bids: true, winner: true },    /* Actualmente devuelve todo el objeto de la Auction a la cual pertenece */
      });

      if (!lot) {
        throw new HttpException('Lot not found', HttpStatus.NOT_FOUND);
      }
      return lot;
    } catch (error) {
      throw new HttpException(
        'An error occurred while retrieving the lot',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* Actualizar un lote */
/*  async update(id: string, updateLotDto: UpdateLotDto, userId: string, userRole: Roles) {
    
    try {
      const existingLot = await this.prisma.lot.findUnique({
        where: { id },
      });
      if (!existingLot) {
        throw new NotFoundException(`Lot with id ${id} not found`);
      }
      if (existingLot.organizerId !== userId && userRole !== Roles.SUPERUSER) {
        throw new ForbiddenException('You do not have permission to update this lot');
      }

      return await this.prisma.lot.update({
        where: { id },
        data: updateLotDto,
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new HttpException(
        `Error updating lot: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
*/
  /* Eliminar (soft delete) un lote */
 /*async remove(id: string, userId: string, userRole: Roles) {
    try {
      const existingLot = await this.prisma.lot.findUnique({
        where: { id },
      });
      if (!existingLot) {
        throw new NotFoundException(`Lot with id ${id} not found`);
      }
      if (existingLot.deletedAt) {
        throw new BadRequestException(`Lot with id ${id} has already been deleted`);
      }
      if (existingLot.organizerId !== userId && userRole !== Roles.SUPERUSER) {
        throw new ForbiddenException('You do not have permission to delete this lot');
      }

      return await this.prisma.lot.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
      throw new HttpException(
        `Error deleting lot: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }*/
}
