import { Injectable, NotFoundException, ForbiddenException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma-setup/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Roles } from '../common';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) { }
  async create(createPropertyDto: CreatePropertyDto, userId: string) {
    try {
      return await this.prisma.property.create({
        data: {
          ...createPropertyDto,
          userId,
          createdAt: createPropertyDto.createdAt || new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
  async update(id: string, updatePropertyDto: UpdatePropertyDto, userId: string, userRole: Roles) {

    try {
      const existingProperty = await this.prisma.property.findUnique({
        where: { id },
        select: { userId: true },
      });

      if (!existingProperty) {
        throw new NotFoundException();
      }

      if (existingProperty.userId !== userId && userRole !== Roles.SUPERUSER) {
        throw new ForbiddenException();
      }

      return await this.prisma.property.update({
        where: { id },
        data: updatePropertyDto,
      });

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string, userId: string, userRole: Roles) {
    try {
      const existingProperty = await this.prisma.property.findUnique({
        where: { id },
      });

      if (!existingProperty) {
        throw new NotFoundException();
      }

      if (!existingProperty.available) {
        throw new BadRequestException();
      }

      if (existingProperty.userId !== userId && userRole !== Roles.SUPERUSER && userRole !== Roles.ADMIN) {
        throw new ForbiddenException();
      }

      return await this.prisma.property.update({
        where: { id },
        data: {
          available: false,
          deletedAt: new Date(),
        },
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const maxLimit = 100;
    const adjustedLimit = Math.min(limit, maxLimit);

    try {
      const whereClause = { available: true };

      const [data, total] = await Promise.all([     /* Promise.all ejecuta las consultas findMany y count en paralelo */
        this.prisma.property.findMany({
          skip,
          take: adjustedLimit,
          where: whereClause, /* whereClause: filtra por el campo state, que está definido como un enum */
        }),
        this.prisma.property.count({ where: whereClause }),
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
  async findOne(id: string) {
    try {
      const property = await this.prisma.property.findFirst({
        where: { 
          id,
          available: true, 
        },
      });

      if (!property || !property.available) throw new NotFoundException();

      return property;

    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}



