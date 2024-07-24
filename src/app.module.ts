import { MiddlewareConsumer, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { MOVIE_ENTITIES } from './constants/constants';
import { MovieModule } from './movie/movie.module';
import { AppService } from './services/app.service';
import { createSessionConfig } from './system/middlewares/session.config.';
import { TheaterModule } from './theater/theater.module';
import { UserModule } from './user/user.module';

const getEntities = (entities: { [key: string]: any }): any[] => {
  return Object.keys(entities).map((key) => entities[key]);
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: '123456',
      database: 'movies',
      entities: getEntities(MOVIE_ENTITIES),
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    MovieModule,
    TheaterModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  // Adding passport.initialize(), passport.session() after session config if passport session is applied
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(createSessionConfig()).forRoutes('*');
  }
}
