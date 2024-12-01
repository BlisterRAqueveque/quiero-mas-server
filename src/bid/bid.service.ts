import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable,  NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma-setup/prisma.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { Roles } from '@prisma/client';

@Injectable()
export class BidService {
  constructor(private readonly prisma: PrismaService) {}

  /* crear una puja (Bid) */ 
  async createBid(createBidDto: CreateBidDto, userId: string) {
    
    const { lotId, amount } = createBidDto;
    
    /*Verificar si el lote existe*/

    const lot = await this.prisma.lot.findUnique({
      where: { id: lotId },
    });

    if (!lot) {
      throw new NotFoundException("Lote no encontrado");
    }

    /* Validar que el precio de la puja sea mayor al precio actual del lote (Ver si queremos guardar el precio inicial y el precio actualizado según puja de cada lote)*/

    if (amount <= lot.startingPrice) {
      throw new BadRequestException(
        `La puja debe ser mayor al precio actual del lote ($${lot.startingPrice}).`,
      );
    }

    /* Crear la puja */ 
    const newBid = await this.prisma.bid.create({
      data: {
        ...createBidDto,
        userId,
        createdAt: new Date(),
      },
    });

    /* Actualizar el precio actual del lote con el nuevo precio de la puja */ 
    await this.prisma.lot.update({
      where: { id: lotId },
      data: { startingPrice: amount },
    });
    
    return newBid;
  }


  async findAllBids() {
    return this.prisma.bid.findMany();
  }

  async findOneBid(id: string) {
    return this.prisma.bid.findUnique({ where: { id } });
  }
  async updateBid(id: string, updateBidDto: UpdateBidDto, userId: string, userRole: Roles) {
    try {
      // Busca la bid existente
      const existingBid = await this.prisma.bid.findUnique({
        where: { id },
      });
  
      if (!existingBid) {
        // Lanza una excepción si no se encuentra la bid
        throw new NotFoundException(`Bid with id ${id} not found`);
      }
  
      // Verifica si el usuario tiene permisos para actualizar la bid
      if (existingBid.userId !== userId && userRole !== Roles.ADMIN) {
        throw new ForbiddenException('You do not have permission to update this bid');
      }
  
      // Realiza la actualización
      return await this.prisma.bid.update({
        where: { id },
        data: updateBidDto,
      });
    } catch (error) {
      // Manejo de errores específicos
      if (error instanceof NotFoundException || error instanceof ForbiddenException) {
        throw error;
      }
  
      // Manejo general de errores
      throw new HttpException(
        `Error updating bid: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  







  async removeBid(id: string) {
    return this.prisma.bid.delete({ where: { id } });
  }
}
