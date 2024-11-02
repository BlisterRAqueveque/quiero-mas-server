import { Module             } from '@nestjs/common';
import { AuctionService     } from './auction.service';
import { AuctionController  } from './auction.controller';
import { AuthModule         } from '../auth/auth.module';
import { PrismaModule } from '../prisma-setup/prisma.module';


@Module({
  imports:     [AuthModule, PrismaModule],
  controllers: [AuctionController],
  providers: [AuctionService],
})
export class AuctionModule {}
