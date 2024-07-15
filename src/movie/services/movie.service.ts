import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MOVIE_ENTITIES } from '../../constants/constants';
import { Helper } from '../../helpers/helper';
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

    banners.forEach(banner =>{
      banner.phim.hinhAnh = Helper.convertBufferToBase64(banner.phim.hinhAnh) as any;
    })

    return banners;
  }

  async getMovieById(id: string) {
    const movie = await this.movieRepository.findOne({ where: { maPhim: id } });

    if (movie) {
      movie.hinhAnh = Helper.convertBufferToBase64(movie.hinhAnh) as any;
    }

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

  async createMovie(movieData: MovieEntity) {
    return await this.movieRepository.save(movieData);
  }

  async updateMovieById(id: string, movieData: MovieEntity) {
    return await this.movieRepository
      .createQueryBuilder()
      .update(MovieEntity)
      .set(movieData as any)
      .where('id = :id', {id})
      .execute();
  }

  async getMoviesByName(tenPhim: string){
    const queryBuilder = this.movieRepository.createQueryBuilder('movie');

    if (tenPhim){
      queryBuilder.where('LOWER(movie.tenPhim) LIKE LOWER(:name)',{ name: `%${tenPhim}%` });
    }
   
    let movies = await queryBuilder.getMany();

    movies.forEach(movie =>{
      movie.hinhAnh = Helper.convertBufferToBase64(movie.hinhAnh) as any
    })

    return movies;
  }
}
