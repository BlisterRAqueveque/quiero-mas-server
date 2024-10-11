import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response                                } from 'express';
import { UpdateUserDto, UsersService                           } from '../../users';
import { AuthService                                           } from '../auth.service';

export interface RequestModel {
  user: UpdateUserDto;
  headers: any;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  async use(
    req: RequestModel,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      const tokenArray: string[] = req.headers['authorization'].split(' ');
      const decodedToken = await this.authService.verifyJwt(tokenArray[1]);

      let user: UpdateUserDto = await this.userService.findOne(
        decodedToken.id,
      );

      if (decodedToken) {
        if (user.id == decodedToken.id) next();
        else throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch (e) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
