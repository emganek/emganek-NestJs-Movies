import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MOVIE_ENTITIES } from '../../constants/constants';
import { BannerEntity } from '../entities/banner.entity';
import { MovieEntity } from '../entities/movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MOVIE_ENTITIES.MovieEntity)
    private movieRepository: Repository<MovieEntity>,
    @InjectRepository(MOVIE_ENTITIES.BannerEntity)
    private bannerRepository: Repository<BannerEntity>,
  ) {}

  async getBanner() {
    const banners = await this.bannerRepository
      .createQueryBuilder('banner')
      .leftJoinAndSelect('banner.phim', 'movie')
      .getMany();

    return banners;
  }

  async getMovies() {
    return await this.movieRepository.find();
  }

  async getMovieById(id: string) {
    return await this.movieRepository.findOne({ where: { maPhim: id } });
  }
}
