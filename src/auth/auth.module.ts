import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '../configuration';
import { UsersModule } from '../users';
import { AuthService } from './auth.service';
import { AuthStrategy } from './strategy/auth.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: envs.jwt_seed,
      signOptions: {
        expiresIn: '24h',
      },
    }),
    UsersModule,
  ],
  providers: [AuthService, AuthStrategy],
  exports: [AuthService],
})
export class AuthModule {}
