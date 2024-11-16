import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { AuthModule } from '../auth';
import { PrismaModule } from '../prisma-setup/prisma.module';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [BidController],
  providers: [BidService],
})
export class BidModule {}
