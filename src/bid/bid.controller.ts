import { Controller, Post, Body, Param, Get, Patch, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserRoleGuard } from 'src/auth/guards/user-role.guard';


@Controller('bids')

export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Auth()
  @Post()
  async createBid(@Body() createBidDto: CreateBidDto, @GetUser('id') userId: string) {
    return this.bidService.createBid(createBidDto, userId);
  }

  @Get()
  async findAllBids() {
    return this.bidService.findAllBids();
  }

  @Get(':id')
  async findOneBid(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.bidService.findOneBid(id);
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

    /*
  @Auth()
  @Delete(':id')
  async removeBid(@Param('id', new ParseUUIDPipe()) id: string,
  @GetUser('id') userId: string,
) {
    return this.bidService.removeBid(id, userId);
  }*/
}
