import { Module         } from '@nestjs/common';
import { LotService     } from './lot.service';
import { LotController  } from './lot.controller';
import { AuthModule     } from '../auth';
import { PrismaModule   } from '../prisma-setup/prisma.module';

@Module({
  imports:      [AuthModule, PrismaModule],
  controllers:  [LotController],
  providers:    [LotService],
})
export class LotModule {}
