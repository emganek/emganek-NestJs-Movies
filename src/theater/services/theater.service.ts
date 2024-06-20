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
import { Seat } from '../models/seat';
import { Booking, BookingSeat } from '../models/booking';
import { UserEntity } from '../../user/entities/user.entity';

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
      danhSachChoNgoi: this.generateSeats(data.giaVe),
      users: []
    };

    return await this.theaterScheduleRepository.save(schedule);
  }

  async getShowTimeByMovieCode(movieCode: string) {
    const movie = await this.movieService.getMovieById(movieCode);

      return await this.theaterChainRepository
      .createQueryBuilder('theaterChain')
      .leftJoinAndMapMany('theaterChain.heThongRap', TheaterLocationEntity, 'theater', `theaterChain.id = theater.heThongRapid`)
      .leftJoinAndMapMany('theater.suatChieu', TheaterScheduleEntity, 'schedule', `schedule.phimId = ${movie.id} && schedule.rapId = theater.id`)
      .leftJoinAndMapOne('theater.phim', MovieEntity, 'movie',  `movie.id = ${movie.id}`)
      .getMany()
  }

  async getInformationForBooking(scheduleId: string) {
      return await this.theaterScheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.id = :id', {id: scheduleId})
      .leftJoinAndMapOne('schedule.rap', TheaterLocationEntity, 'theater', `theater.id = schedule.rapId`)
      .leftJoinAndMapOne('schedule.phim', MovieEntity, 'movie',  `movie.id = schedule.phimId`)
      .getOne()
  }

//   async getBookedMoviesByUserId(userId: string) {
//     return await this.theaterScheduleRepository
//     .createQueryBuilder('schedule')
//     .where('schedule.id = :id', {id: scheduleId})
//     .leftJoinAndMapOne('schedule.rap', TheaterLocationEntity, 'theater', `theater.id = schedule.rapId`)
//     .leftJoinAndMapOne('schedule.phim', MovieEntity, 'movie',  `movie.id = schedule.phimId`)
//     .getOne()
// }

  async bookingSchedule(userLoggedIn: UserEntity, bookingData: Booking) {
    const showtime = await this.theaterScheduleRepository
      .createQueryBuilder('schedule')
      .where('schedule.id = :id', {id: bookingData.maLichChieu})
      .getOne();

      bookingData.danhSachVe.forEach((seat: BookingSeat, index: number) =>{
        const selectedSeat = showtime.danhSachChoNgoi[seat.soGhe - 1];
        selectedSeat.daDat = true;
        selectedSeat.userId = userLoggedIn.id;
      })

      const index = showtime.users?.findIndex(user => user.id === userLoggedIn.id);

      if (!index){
        showtime.users = showtime.users ?? [];
        showtime.users.push(userLoggedIn);
      }

      return await this.theaterScheduleRepository.save(showtime);

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

  private generateSeats(cost: number, numberSeats = 160,): Seat[]{
    const seats:any = [];
    for (let i = 1; i <= numberSeats; i++){
      const loaiGhe =  i > 32 && i < 129 ? 'vip' : 'thuong';
      const giaVe = loaiGhe === 'vip' ? Math.floor(cost + (cost *20)/100) : cost;
      seats.push(new Seat(i, giaVe,loaiGhe));
    }

    return [...seats];
  }
}

