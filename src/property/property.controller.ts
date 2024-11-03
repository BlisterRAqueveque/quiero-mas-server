import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, ParseUUIDPipe, Query } from '@nestjs/common';
import { PropertyService                }  from './property.service';
import { CreatePropertyDto              } from './dto/create-property.dto';
import { UpdatePropertyDto              } from './dto/update-property.dto';
import { GetUser, Auth, RoleProtected                   } from '../auth/decorators';
import { Roles              } from '../common';
import { UserRoleGuard } from '../auth/guards/user-role.guard';


@Controller('properties')
export class PropertyController {
    constructor(private propertyService: PropertyService) {}


    @Auth()
    @Post()
    async create(@Body() createPropertyDto: CreatePropertyDto, @GetUser('id') userId: string) {
        return this.propertyService.create(createPropertyDto, userId);
    }

    @Get()
    async findAll( 
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ){
        return this.propertyService.findAll(page, limit);
    }

    @Get(':id')
    async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.propertyService.findOne(id);
    }

    @Auth()
    @RoleProtected(Roles.USER, Roles.SUPERUSER)
    @UseGuards(UserRoleGuard)
    @Patch(':id')
    async update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() updatePropertyDto: UpdatePropertyDto,
        @GetUser('id') userId: string,
        @GetUser('role') userRole: Roles
    ) {
        return this.propertyService.update(id, updatePropertyDto, userId, userRole);
    }

        /* TODO: El usuario que creó la Property podrá eliminarla, también el Superusuario y el Admin */
    @Auth()
    @RoleProtected(Roles.USER, Roles.SUPERUSER)
    @UseGuards(UserRoleGuard)
    @Delete(':id')
    async remove(
      @Param('id', new ParseUUIDPipe()) id: string,
      @GetUser('id') userId: string,
      @GetUser('role') userRole: Roles
    ) {
        return this.propertyService.remove(id, userId, userRole);
    }

}
