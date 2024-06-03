import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './services/movie.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ENTITIES } from '../constants/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([ENTITIES.MovieEntity, ENTITIES.BannerEntity]),
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}
