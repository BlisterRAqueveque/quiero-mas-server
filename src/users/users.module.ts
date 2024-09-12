import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, MAIL_SERVICE } from 'src/configuration';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    ClientsModule.register([
      {
        name: MAIL_SERVICE,
        transport: Transport.TCP,
        options: {
          port: envs.mail_port,
          host: envs.mail_host,
        },
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
