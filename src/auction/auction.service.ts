import { Injectable       } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { PrismaService    } from '../prisma-setup/prisma.service';

@Injectable()
export class AuctionService{
  constructor(private readonly prisma: PrismaService) {}

  // Crear una nueva subasta
  async create(createAuctionDto: CreateAuctionDto) {
    return this.prisma.auction.create({
      data: {
        ...createAuctionDto,
        createdAt: createAuctionDto.createdAt || new Date(),
      },
    });
  }

  // Obtener todas las subastas con paginación
  async findAll(params: { skip?: number; take?: number }) {
    const { skip, take } = params;
    return this.prisma.auction.findMany({
      skip,
      take,
      where:   { available: true }, // Solo subastas activas
      include: { organizer: true, lots: true }, // Incluimos las relaciones necesarias
      orderBy: { auctionDate: 'desc' },
    });
  }

  // Obtener una subasta por su ID
  async findOne(id: string) {
    return this.prisma.auction.findUnique({
      where:   { id },
      include: { organizer: true, lots: true },
    });
  }

  // Actualizar una subasta
  async update(id: string, updateAuctionDto: UpdateAuctionDto) {
    return this.prisma.auction.update({
      where: { id },
      data: updateAuctionDto,
    });
  }

  // Eliminar (soft delete) una subasta
  async remove(id: string) {
    return this.prisma.auction.update({
      where: { id },
      data:  {
        available: false,
        deletedAt: new Date(),
      },
    });
  }
}
