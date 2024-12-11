import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma-setup/prisma.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class BidService {
  constructor(private readonly prisma: PrismaService) { }

  /* Crear una puja (Bid) */
  async createBid(createBidDto: CreateBidDto, userId: string) {

    const { lotId, amount } = createBidDto;

    try {

      /* Valida que el monto ingresado por el usuario tiene un formato correcto */
      const isValidAmount = /^(\d+)(\.\d{1,2})?$/.test(amount.toString());
      if (!isValidAmount) {
        throw new BadRequestException();
      }

      const lot = await this.prisma.lot.findUnique({    /*Verificar si el lote existe*/
        where: { id: lotId },
        select: { startingPrice: true }
      });

      if (!lot) {
        throw new NotFoundException("Lote no encontrado");
      }

      const currentPrice = new Decimal(lot.startingPrice);
      const bidAmount = new Decimal(amount);

      if (bidAmount.lte(currentPrice)) {
        throw new BadRequestException();
      }

      /* Crear la puja */
      const newBid = await this.prisma.bid.create({
        data: {
          ...createBidDto,
          userId,
          createdAt: createBidDto.createdAt || new Date(),
        },
      });

      /* Actualizar el precio actual del lote con el nuevo precio de la puja */
      await this.prisma.lot.update({
        where: { id: lotId },
        data: { startingPrice: bidAmount.toNumber() },
      });

      return newBid;
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }


  async findAllBids() {
    try {
      return this.prisma.bid.findMany();
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async findOneBid(id: string) {
    try {
      const bid = await this.prisma.bid.findUnique({ where: { id } });

      if (!bid) {
        throw new NotFoundException()
      }
      return bid;
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }
  /*
  async updateBid(id: string, updateBidDto: UpdateBidDto, userId: string) {
    try {
      // Busca la bid existente
      const existingBid = await this.prisma.bid.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!existingBid) {
        throw new NotFoundException();
      }*/

    /*   Verifica si el usuario que quiere actualizar la bid es el que la creó*/ 
    /*  if (existingBid.userId !== userId) {
        throw new ForbiddenException();
      } */

      /* Realiza la actualización*/
     /* return await this.prisma.bid.update({
        where: { id },
        data: updateBidDto,
      });
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }*/

    /*
  async removeBid(id: string, userId: string) {
    try {*/
      /* Verificar si la puja existe */
     /* const existingBid = await this.prisma.bid.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!existingBid) {
        throw new NotFoundException('Puja no encontrada');
      }*/

      /* Validar permisos*/
     /* if (existingBid.userId !== userId) {
        throw new ForbiddenException();
      }

      return await this.prisma.bid.delete({ where: { id } });

    } catch (error) {
      throw new InternalServerErrorException('Error al eliminar la puja');
    }
  }*/
}
