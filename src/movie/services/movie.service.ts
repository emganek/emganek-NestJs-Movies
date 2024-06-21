import { Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MOVIE_ENTITIES } from '../../constants/constants';
import { BannerEntity } from '../entities/banner.entity';
import { MovieEntity } from '../entities/movie.entity';
import { AuthzGuard } from '../../auth/guards/authz.guard';
import { UpdateMovie } from '../models/update-movie';
import { Helper } from '../../helpers/helper';

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

    banners.forEach(banner =>{
      banner.phim.hinhAnh = Helper.convertBufferToBase64(banner.phim.hinhAnh) as any;
    })

    return banners;
  }

  async getMovies() {
    const movies = await this.movieRepository.find();

    movies.forEach(movie =>{
      movie.hinhAnh = Helper.convertBufferToBase64(movie.hinhAnh) as any
    })

    return movies;
  }

  async getMovieById(id: string) {
    const movie = await this.movieRepository.findOne({ where: { maPhim: id } });

    movie.hinhAnh = Helper.convertBufferToBase64(movie.hinhAnh) as any;

    return movie;
  }

  async deleteMovieById(id: string) {
    return await this.movieRepository
      .createQueryBuilder()
      .delete()
      .from(MovieEntity)
      .where('id = :id', {id})
      .execute();
  }

  async updateMovieById(id: string, movieData: MovieEntity) {
    return await this.movieRepository
      .createQueryBuilder()
      .update(MovieEntity)
      .set(movieData as any)
      .where('id = :id', {id})
      .execute();
  }
}
