import { Controller, Post, Body, Param, Get, Delete, ParseUUIDPipe } from '@nestjs/common';
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Auth } from '../auth/decorators/auth.decorator';

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

    
  @Auth()
  @Delete(':id')
  async removeBid(@Param('id', new ParseUUIDPipe()) id: string,
  @GetUser('id') userId: string,
) {
    return await this.bidService.removeBid(id, userId);
  }
}
