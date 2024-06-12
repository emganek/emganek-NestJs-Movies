import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MOVIE_ENTITIES } from '../constants/constants';
import { MovieController } from './movie.controller';
import { MovieService } from './services/movie.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MOVIE_ENTITIES.MovieEntity,
      MOVIE_ENTITIES.BannerEntity,
    ]),
  ],
  controllers: [MovieController],
  providers: [MovieService],
  exports: [MovieService],
})
export class MovieModule {}
