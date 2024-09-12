import { Controller, Get, Query, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('auth/verificar')
  @Render('verificar')
  async verificarMail(@Query('token') token: string) {
    return { token };
  }
}
