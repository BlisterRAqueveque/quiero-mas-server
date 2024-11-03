import { Injectable, NotFoundException, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService  } from '../prisma-setup/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { Roles          } from '../common';

@Injectable()
export class PropertyService {
    constructor(private prisma: PrismaService) {}

    async create(createPropertyDto: CreatePropertyDto, userId: string) {
        return this.prisma.property.create({
            data: {
                ...createPropertyDto,
                userId,
                createdAt: createPropertyDto.createdAt || new Date(),
            },
        });
    }


    async update(id: string, updatePropertyDto: UpdatePropertyDto, userId: string, userRole: Roles) {
        const existingProperty = await this.prisma.property.findUnique({ where: { id } });

        if (!existingProperty) {
            throw new NotFoundException(`Property with id ${id} not found`);
        }

        if (existingProperty.userId !== userId && userRole !== Roles.SUPERUSER) {
            throw new ForbiddenException('You do not have permission to update this property');
        }

        return this.prisma.property.update({
            where: { id },
            data: updatePropertyDto,
        });
    }

    async remove(id: string, userId: string, userRole: Roles) {
        const existingProperty = await this.prisma.property.findUnique({ where: { id } });

        if (!existingProperty) {
            throw new NotFoundException(`Property with id ${id} not found`);
        }

        if (existingProperty.userId !== userId && userRole !== Roles.SUPERUSER) {
            throw new ForbiddenException('You do not have permission to delete this property');
        }

        return this.prisma.property.update({
            where: { id },
            data: { 
              available: false,
              deletedAt: new Date() },
        });

    }

      async findAll(page: number, limit: number) {
        const skip = (page - 1) * limit;
        const maxLimit = 100;
        const adjustedLimit = Math.min(limit, maxLimit);
    
        try {
          const whereClause =  { 
            available: true,
          };
            
          const [data, total] = await Promise.all([     /* Promise.all ejecuta las consultas findMany y count en paralelo */
            this.prisma.property.findMany({
              skip,
              take: adjustedLimit,
              where: whereClause,
                                    /* whereClause: filtra por el campo state, que está definido como un enum */
            }),
            this.prisma.property.count({ where: whereClause}),
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
        'Error retrieving properties, please try again later.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

    async findOne(id: string) {
        const property = await this.prisma.property.findUnique({ where: { id } });

        if (!property) {
            throw new NotFoundException(`Property with id ${id} not found`);
        }

        return property;
    }
}

