import { Module             } from '@nestjs/common';
import { AuctionService     } from './auction.service';
import { AuctionController  } from './auction.controller';
import { AuthModule         } from '../auth/auth.module';


@Module({
  imports:     [AuthModule],
  controllers: [AuctionController],
  providers:   [AuctionService],
})
export class AuctionModule {}
