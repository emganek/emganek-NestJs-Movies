import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { MOVIE_ENTITIES } from '../../constants/constants';
import { MovieService } from '../../movie/services/movie.service';
import { TheaterChainEntity } from '../entities/theater-chain.entity';
import { TheaterLocationEntity } from '../entities/theater-location.entity';
import { TheaterScheduleEntity } from '../entities/theater-schedule.entity';
import { Showtime } from '../models/showtime';
import { addHours, format } from 'date-fns';
import { DateHelper } from '../../helpers/helper';
import { MovieEntity } from '../../movie/entities/movie.entity';

@Injectable()
export class TheaterService {
  constructor(
    @InjectRepository(MOVIE_ENTITIES.TheaterChainEntity)
    private theaterChainRepository: Repository<TheaterChainEntity>,
    @InjectRepository(MOVIE_ENTITIES.TheaterLocationEntity)
    private theaterLocationRepository: Repository<TheaterLocationEntity>,
    @InjectRepository(MOVIE_ENTITIES.TheaterScheduleEntity)
    private theaterScheduleRepository: Repository<TheaterScheduleEntity>,
    private movieService: MovieService,
  ) {}

  async getTheaterChains() {
    return this.theaterChainRepository.find();
  }

  async getLocationByTheaterChainCode(theaterChainCode: string) {
    const theaterChain = await this.theaterChainRepository
      .createQueryBuilder('theater')
      .where('theater.maHeThongRap = :id', { id: theaterChainCode })
      .getOne();

    return this.theaterLocationRepository
      .createQueryBuilder('location')
      .leftJoin('location.heThongRap', 'theaterChain')
      .where('location.heThongRap = :id', { id: theaterChain.id })
      .getMany();
  }

  async createShowTime(data: Showtime) {
    const theaterLocation = await this.theaterLocationRepository.findOne({
      where: {
        maRap: data.maRap,
      },
    });

    const movie = await this.movieService.getMovieById(data.maPhim);

    const isAvailable = await this.checkShowtimeAvailable(data.ngayChieuGioChieu, theaterLocation.id, movie.id);

    if (!isAvailable){
      throw new HttpException('Not available time slot', HttpStatus.CONFLICT);
    }

    const schedule: TheaterScheduleEntity = {
      rap: theaterLocation.id,
      phim: movie.id,
      giaVe: data.giaVe,
      ngayChieuGioChieu: DateHelper.parseDate(data.ngayChieuGioChieu),
      danhSachChoNgoi: [],
    };

    return await this.theaterScheduleRepository.save(schedule);
  }

  // async getShowTimeByMovieCode(movieCode: string) {
  //   const movie = await this.movieService.getMovieById(movieCode);

  //   return await this.theaterScheduleRepository
  //     .createQueryBuilder('schedule')
  //     .where(
  //       'schedule.phim = :phimId', {phimId: movie.id}
  //     )
  //     .leftJoinAndMapOne('schedule.phim', MovieEntity,'phim', 'phim.id = schedule.phimId')
  //     .leftJoinAndMapOne('schedule.rap', TheaterLocationEntity ,'rap', 'rap.id = schedule.rapId')
  //     .select([
  //       'schedule.ngayChieuGioChieu',
  //       'phim.id',
  //       'phim.tenPhim',
  //       'rap.id',
  //       'rap.tenRap'
  //     ])
  //     .orderBy('schedule.ngayChieuGioChieu', "DESC")
  //     .getMany();
  // }

  async getShowTimeByMovieCode(movieCode: string) {
    const movie = await this.movieService.getMovieById(movieCode);

    return await this.theaterLocationRepository
      .createQueryBuilder('theater')
      .leftJoinAndMapOne('theater.suatChieu', TheaterScheduleEntity, 'schedule', `schedule.phimId = ${movie.id}`)
      .groupBy('theater.heThongRapId')
      .getMany();
  }

  private async checkShowtimeAvailable(date: string | Date, rapId: string, phimId:string) {
    date = DateHelper.parseDate(date);

    const showtime = await this.theaterScheduleRepository
      .createQueryBuilder('schedule')
      .where(
        `schedule.ngayChieuGioChieu BETWEEN '${DateHelper.convertToDatabaseFormat(addHours(date, -2))}' AND '${DateHelper.convertToDatabaseFormat(addHours(date, 2))}'`,
      )
      .andWhere(
        'schedule.rap = :rapId', {rapId}
      )
      .andWhere(
        'schedule.phim = :phimId', {phimId}
      )
      .getOne();

      return !showtime;
  }
}
