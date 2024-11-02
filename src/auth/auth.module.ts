import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { envs } from '../configuration';
import { UsersModule } from '../users';
import { AuthService } from './auth.service';
import { AuthStrategy } from './strategy/auth.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}), /* AuthGuard depende de PassportModule para configurar la strategy de auth, por eso tenemos que tener disponible PassportModule en cualquier módulo que usa AuthGuard. Con esto Cualquier módulo que importe AuthModule puede acceder a PassportModule y a la strategy JWT. */
    JwtModule.register({
      secret: envs.jwt_seed,
      signOptions: {
        expiresIn: '24h',
      },
    }),
    UsersModule,
  ],
  providers: [AuthService, AuthStrategy],
  exports: [AuthService, PassportModule],
})
export class AuthModule {}
