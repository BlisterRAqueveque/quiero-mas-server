import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma-setup/prisma.service';
import { CreateLotDto } from './dto/create-lot.dto';
import { Roles } from '@prisma/client';

@Injectable()
export class LotService {
  constructor(private readonly prisma: PrismaService) { }

  /* Crear un nuevo lote */
  async create(createLotDto: CreateLotDto, organizerId: string) {

    try {
      const auction = await this.prisma.auction.findUnique({            /* Verifica que el usuario autenticado sea el creador de la subasta */
        where: { id: createLotDto.auctionId },
      });

      if (!auction) {
        throw new NotFoundException();;
      }

      if (auction.organizerId !== organizerId) {
        throw new ForbiddenException();
      }

      return this.prisma.lot.create({               /*   Si la verificación pasa, crea el lote */
        data: {
          ...createLotDto,
          createdAt: createLotDto.createdAt || new Date(),
          auctionId: createLotDto.auctionId,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  /* Obtener todos los lotes con paginación */
  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const maxLimit = 100;
    const adjustedLimit = Math.min(limit, maxLimit);

    try {

      const whereClause: any = {
        available: true,
      };


      const [data, total] = await Promise.all([
        this.prisma.lot.findMany({
          skip,
          take: adjustedLimit,
          where: whereClause,  
        }),
        this.prisma.lot.count({ where: whereClause }),
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
      throw new InternalServerErrorException();
    }
  }

  /* Obtener un lote por su ID */
  async findOne(id: string) {
    try {
      const lot = await this.prisma.lot.findUnique({
        where: { id },
        include: { auction: true, bids: true, winner: true },    /* Actualmente devuelve todo el objeto de la Auction a la cual pertenece */
      });

      if (!lot || !lot.available) {
        throw new NotFoundException();
      }
      return lot;
    } catch (error) {
      if (
        error instanceof NotFoundException 
      ) {
        throw error;
      }
      throw new InternalServerErrorException();
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
        if (existingLot.organizerId !== userId && userRole !== Roles.SUPERUSER || Roles.AUCTIONEER || Roles.USER ) {
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
  async remove(id: string, userId: string, userRole: Roles) {
    try {
      const existingLot = await this.prisma.lot.findUnique({
        where: { id },
        include: {
          auction: {
            select: {
              organizerId: true,
            }
          }
        }
      });

      if (!existingLot) {
        throw new NotFoundException();
      }
      if (!existingLot.available) {
        throw new BadRequestException();
      }
      if (existingLot.auction.organizerId !== userId && userRole !== Roles.SUPERUSER && userRole !== Roles.ADMIN ) {
        throw new ForbiddenException();
      }

      return await this.prisma.lot.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          available: false,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
