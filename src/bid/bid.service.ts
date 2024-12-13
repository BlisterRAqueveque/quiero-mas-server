import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma-setup/prisma.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { Roles } from '../common';

@Injectable()
export class BidService {
  constructor(private readonly prisma: PrismaService) { }

  /* Crear una puja (Bid) */
  async createBid(createBidDto: CreateBidDto, userId: string) {

    const { lotId, amount } = createBidDto;

    try {

      const lot = await this.prisma.lot.findUnique({    /*Verificar si el lote existe*/
        where: { id: lotId },
        select: { 
          startingPrice: true,
          currentPrice: true,
          available: true,
         }
      });

      if (!lot || !lot.available) {
        throw new NotFoundException();
      }

      /* Valida que el monto ingresado por el usuario tiene un formato correcto */
      const isValidAmount = /^(\d+)(\.\d{1,2})?$/.test(amount.toString());
      if (!isValidAmount) {
        throw new BadRequestException();
      }

      const currentPrice = new Decimal(lot.currentPrice);
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
        data: { currentPrice: bidAmount.toNumber() },
      });

      return newBid;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException()
    }
  }

  async findAllBids() {
    try {

      const whereClause: any = {
        available: true,
      };

      return await this.prisma.bid.findMany();
    } catch (error) {
      throw new InternalServerErrorException()
    }
  }

  async findOneBid(id: string) {
    try {

      const bid = await this.prisma.bid.findUnique({ 
        where: { id },
      include: { user: {
        select: {username: true}      /* Si queremos que regrese más campos del usuario que realizó la Bid, los agregamos acá */
      }} });

      if (!bid || !bid.available) {
        throw new NotFoundException()
      }
      return bid;
    } catch (error) {
      if (
        error instanceof NotFoundException
      ) {
        throw error;
      }
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

    /* Preguntar a Caro si una puja por un lote se puede eliminar */
    /* TODO: si una puja se elimina, eliminar la puja de la Auction y actualizar su valor */

    
  async removeBid(id: string, userId: string, userRole: Roles) {
    try {
   
      const existingBid = await this.prisma.bid.findUnique({     /* Verificar si la puja existe */
        where: { id }
      });

      if (!existingBid) {
        throw new NotFoundException();
      }

      if (!existingBid.available) {
        throw new BadRequestException();
      }

      if (existingBid.userId !== userId && userRole !== Roles.SUPERUSER) {    /* Validar permisos*/ 
        throw new ForbiddenException();
      }

      return await this.prisma.bid.update({ 
        where: { id },
        data: {
          available: false,
          deletedAt: new Date()
        } });

    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
