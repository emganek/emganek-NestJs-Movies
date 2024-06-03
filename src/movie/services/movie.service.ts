import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITIES } from '../../constants/constants';
import { Repository } from 'typeorm';
import { MovieEntity } from '../entities/movie.entity';
import { BannerEntity } from '../entities/banner.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(ENTITIES.MovieEntity)
    private movieRepository: Repository<MovieEntity>,
    @InjectRepository(ENTITIES.BannerEntity)
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
}
