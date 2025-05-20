import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import TransformInterceoptor from './common/interceptors/transform.interceptor';
import { AuthGuard } from './common/guards/auth.guard';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { AdminModule } from './modules/admin/admin.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { MoviesModule } from './modules/movies/movies.module';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    AuthModule,
    SubscriptionsModule,
    AdminModule,
    ReviewsModule,
    FavoritesModule,
    MoviesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceoptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
