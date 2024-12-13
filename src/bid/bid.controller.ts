import { Controller, Post, Body, Param, Get, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { RoleProtected } from '../auth/decorators/role-protected.decorator';
import { Roles } from '../common';
import { UserRoleGuard } from '../auth/guards/user-role.guard';

@Controller('bids')

export class BidController {
  constructor(private readonly bidService: BidService) {}
  @Auth()
  @Post()
  async createBid(@Body() createBidDto: CreateBidDto, @GetUser('id') userId: string) {
    return await this.bidService.createBid(createBidDto, userId);
  }
  
  @Get()
  async findAllBids() {
    return await this.bidService.findAllBids();
  }

  @Get(':id')
  async findOneBid(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.bidService.findOneBid(id);
  }

  /*
  @Auth()
  @Patch(':id')
  async updateBid(
    @Param('id', new ParseUUIDPipe()) id: string, 
    @Body() updateBidDto: UpdateBidDto,
    @GetUser('id') userId: string) {
    return await this.bidService.updateBid(id, updateBidDto, userId );
  } */

    /* Preguntar a Caro si la bid se puede eliminar */
  @Auth()
  @RoleProtected(Roles.SUPERUSER, Roles.ADMIN)
  @UseGuards(UserRoleGuard)
  @Delete(':id')
  async removeBid(@Param('id', new ParseUUIDPipe()) id: string,
  @GetUser('id') userId: string,
  @GetUser('role') userRole: Roles
  ) {
    return await this.bidService.removeBid(id, userId, userRole);
  }
}
