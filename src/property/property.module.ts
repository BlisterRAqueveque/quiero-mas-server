import { Module             } from '@nestjs/common';
import { PropertyService    } from './property.service';
import { PropertyController } from './property.controller';
import { AuthModule         } from '../auth/auth.module';
import { PrismaModule       } from '../prisma-setup/prisma.module';

@Module({
  imports:     [AuthModule, PrismaModule ],
  controllers: [PropertyController],
  providers:    [PropertyService],
})
export class PropertyModule {}
