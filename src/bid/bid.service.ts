import { BadRequestException, Injectable,  NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma-setup/prisma.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';

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

  async updateBid(id: string, updateBidDto: UpdateBidDto) {
    return this.prisma.bid.update({
      where: { id },
      data: updateBidDto,
    });
  }

  async removeBid(id: string) {
    return this.prisma.bid.delete({ where: { id } });
  }
}
