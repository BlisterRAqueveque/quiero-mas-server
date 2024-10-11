import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envs } from '../../configuration';
import { PayloadDto } from '../../common/payload/payload.dto';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma-setup/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor( private readonly prisma: PrismaService ) 
    
    {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: envs.jwt_seed,
    });
  }

 // Validación de JWT 
 async validate(payload: PayloadDto): Promise<User> {
  const { id } = payload;

  // Buscar al usuario por el ID en el payload
  const user = await this.prisma.user.findUnique({
    where: { id },
  });
  
  if (!user) {
    throw new UnauthorizedException('Token not valid');
  }

  return user; // Retorna el usuario encontrado (automáticamente será adjuntado al request)
}
}
