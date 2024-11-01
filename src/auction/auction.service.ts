import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException       } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { PrismaService    } from '../prisma-setup/prisma.service';
import { State            } from '../common/enums/state.enum';
import { Roles } from 'src/common';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class AuctionService{
  constructor(private readonly prisma: PrismaService) {}

  /* Crear una nueva subasta */ 
  async create(createAuctionDto: CreateAuctionDto, organizerId:string) {
    return this.prisma.auction.create({
      data: {
        ...createAuctionDto,
        organizerId,                    /* usamos el organizerId proporcionado desde el controlador */
        createdAt: createAuctionDto.createdAt || new Date(),
      },
    });
  }

  /* Obtener todas las subastas con paginación */
    async findAll(page: number, limit: number, state?: State) {
      const skip = (page - 1) * limit;
      const maxLimit = 100;
      const adjustedLimit = Math.min(limit, maxLimit);
  
      try {
        const whereClause =  { 
          available: true,
          ...(state? { state } : {}),   /* Construimos el filtro de búsqueda, Se filtra por state sólo si éste es proporcionado, sino devuelve todas las Auctions sin importar su estado */
        };
        const [data, total] = await Promise.all([     /* Promise.all ejecuta las consultas findMany y count en paralelo */
          this.prisma.auction.findMany({
            skip,
            take: adjustedLimit,
            where: whereClause,                       /* whereClause: filtra por el campo state, que está definido como un enum */
          }),
          this.prisma.auction.count({ where: whereClause }),
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
    if (error.name === 'PrismaClientKnownRequestError') {
      throw new HttpException(
        `Database error: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
    throw new HttpException(
      'Error retrieving auctions, please try again later.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

  /* Obtener una subasta por su ID */ 
  async findOne(id: string) {
    try {
      const auction = await this.prisma.auction.findUnique({
        where: { id },
        include: { organizer: {
          select: { id:true }       /* Seleccionamos el campo ID del User que creó la Auction, ACÁ manejamos los campos que queremos que devuelva del user */
        }, 
        lots: true },               /* Seleccionamos el campo ID de los LOTES de la Auction, ACÁ manejamos los campos que queremos que devuelva de cada lote */
      });

      if (!auction) {
        throw new HttpException('Auction not found', HttpStatus.NOT_FOUND); /* Verificamos si no existe la subasta */
      }
      return auction;
    } catch (error) {
      
      if (error.name === 'PrismaClientKnownRequestError') {   /* Si es un error específico de Prisma o de la base de datos */
        throw new HttpException(
          `Database error: ${error.message}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        'An error occurred while retrieving the auction',     /* Otro tipo de error no específico */
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* Actualizar una subasta*/ 
  async update(id: string, updateAuctionDto: UpdateAuctionDto, userId: string, userRole: Roles) {
    try {
      // Buscar la subasta existente
      const existingAuction = await this.prisma.auction.findUnique({
        where: { id },
      });
      
      // Si no se encuentra, lanzar una excepción
      if (!existingAuction) {
        throw new NotFoundException(`Auction with id ${id} not found`);
      }
       // Verificar si el usuario tiene permisos para actualizar (es el creador o tiene rol de SUPERUSER)
       if (existingAuction.organizerId !== userId && userRole !== Roles.SUPERUSER) {
        throw new ForbiddenException('You do not have permission to update this auction');
      }
      
      // Realizar la actualización
      return await this.prisma.auction.update({
        where: { id },
        data: updateAuctionDto,
      });
      
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error; // Mantener el error 404 o 403 
      }
      
      // Para otros errores, lanzar una excepción genérica
      throw new HttpException(
        `Error updating auction: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* Eliminar (soft delete) una subasta*/
  async remove(id: string, userId: string, userRole: Roles) {
      try {
        const existingAuction = await this.prisma.auction.findUnique({
          where: { id },
      });
      
      // Si no se encuentra, lanzar una excepción
      if (!existingAuction) {
        throw new NotFoundException(`Auction with id ${id} not found`);
      }

          // Verificar si la subasta ya fue eliminada
          if (!existingAuction.available) {
            throw new BadRequestException(`Auction with id ${id} has already been deleted`);
          }

      // Verificar si el usuario tiene permisos para eliminar (es el creador o es SUPERUSER)
      if (existingAuction.organizerId !== userId && userRole !== Roles.SUPERUSER) {
        throw new ForbiddenException('You do not have permission to delete this auction');
      }

      // Realizar el soft delete actualizando los campos `available` y `deletedAt`
      return await this.prisma.auction.update({
        where: { id },
        data: {
          available: false,
          deletedAt: new Date(),
        },
      });
      } catch (error) {      
        
        if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error; // Mantener el error 404 o 403
      }
      
      // Para otros errores, lanzar una excepción genérica
      throw new HttpException(
        `Error updating auction: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
