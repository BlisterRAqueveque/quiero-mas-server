import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthMiddleware, AuthModule } from './auth';
import { UsersModule } from './users';
import { MulterModule } from '@nestjs/platform-express';
import { saveImagesToStorage } from './helpers/image.storage';
import { AppController } from './app.controller';
import { PropertyModule } from './property/property.module';
import { AuctionModule } from './auction/auction.module';
import { LotModule } from './lot/lot.module';
import { BidModule } from './bid/bid.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    /**
     * @deprecated
     * Después pasar este módulo al correspondiente.
     */
    MulterModule.register({
      fileFilter: saveImagesToStorage('main').fileFilter,
      storage: saveImagesToStorage('main').storage,
    }),
    PropertyModule,
    AuctionModule,
    LotModule,
    BidModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  //! Apply the middleware for all the routes
  configure(consumer: MiddlewareConsumer,) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        //! Except:
        {
          path: '/users/auth/login',
          method: RequestMethod.POST,
        },
        {
          path: '/users',
          method: RequestMethod.POST,
        },
        {
          path: '/auth/verificar',
          method: RequestMethod.GET,  
        },
      )
      .forRoutes('');
  }
}
