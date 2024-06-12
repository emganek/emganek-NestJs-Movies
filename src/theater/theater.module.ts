import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MOVIE_ENTITIES } from '../constants/constants';
import { MovieModule } from '../movie/movie.module';
import { TheaterService } from './services/theater.service';
import { TheaterController } from './theater.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MOVIE_ENTITIES.TheaterChainEntity,
      MOVIE_ENTITIES.TheaterLocationEntity,
      MOVIE_ENTITIES.TheaterScheduleEntity,
    ]),
    MovieModule
  ],
  controllers: [TheaterController],
  providers: [TheaterService],
})
export class TheaterModule {}
