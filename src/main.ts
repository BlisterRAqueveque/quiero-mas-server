import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './configuration';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix('api/v1', {
    //! Aquí excluimos esta ruta del global prefix
    exclude: [{ path: 'auth/verificar', method: RequestMethod.GET }],
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  await app.listen(envs.port);

  logger.log(`Server running on port: ${envs.port}`);
}
bootstrap();
