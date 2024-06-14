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

      return await this.theaterChainRepository
      .createQueryBuilder('theaterChain')
      .leftJoinAndMapMany('theaterChain.heThongRap', TheaterLocationEntity, 'theater', `theaterChain.id = theater.heThongRapid`)
      .leftJoinAndMapMany('theater.suatChieu', TheaterScheduleEntity, 'schedule', `schedule.phimId = ${movie.id} && schedule.rapId = theater.id`)
      .leftJoinAndMapOne('theater.phim', MovieEntity, 'movie',  `movie.id = ${movie.id}`)
      .getMany()
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


[
  {
      "id": 1,
      "maRap": "cgv_hung_vuong",
      "tenRap": "CGV Hùng Vương Plaza",
      "diaChi": "Tầng 7 | Hùng Vương Plaza, 126 Hồng Bàng, Phường 12, Quận 5, TP. Hồ Chí Minh.",
      "suatChieu": {
          "id": 32,
          "giaVe": 75000,
          "ngayChieuGioChieu": "2024-06-10T13:00:00.000Z",
          "danhSachChoNgoi": []
      },
      "phim": {
          "id": 3,
          "maPhim": "c22",
          "tenPhim": "Minions: Sự Trỗi Dậy của Gru",
          "hinhAnh": "https://media-cdn-v2.laodong.vn/storage/newsportal/2022/7/13/1067935/Minions-1-T-01.jpg?w=660",
          "moTa": "Minions: Sự Trỗi Dậy của Gru",
          "trailer": "https://www.youtube.com/embed/dTQXlDV16SY?si=pfybhbMZfKlnOzcH",
          "ngayKhoiChieu": "2024-01-01",
          "dangChieu": true
      }
  },
  {
      "id": 2,
      "maRap": "cgv_vivo",
      "tenRap": "CGV Vivo City",
      "diaChi": "Lầu 5, Trung tâm thương mại SC VivoCity - 1058 Nguyễn Văn Linh, Quận 7",
      "suatChieu": {
          "id": 32,
          "giaVe": 75000,
          "ngayChieuGioChieu": "2024-06-10T13:00:00.000Z",
          "danhSachChoNgoi": []
      },
      "phim": {
          "id": 3,
          "maPhim": "c22",
          "tenPhim": "Minions: Sự Trỗi Dậy của Gru",
          "hinhAnh": "https://media-cdn-v2.laodong.vn/storage/newsportal/2022/7/13/1067935/Minions-1-T-01.jpg?w=660",
          "moTa": "Minions: Sự Trỗi Dậy của Gru",
          "trailer": "https://www.youtube.com/embed/dTQXlDV16SY?si=pfybhbMZfKlnOzcH",
          "ngayKhoiChieu": "2024-01-01",
          "dangChieu": true
      }
  },
  {
      "id": 3,
      "maRap": "bhd_garden",
      "tenRap": "BHD STAR THE GARDEN",
      "diaChi": "Tầng 4, TTTM Garden Shopping Center, Phố Mễ Trì, P.Mỹ Đình 1, Quận Nam Từ Liêm, Hà Nội",
      "suatChieu": {
          "id": 32,
          "giaVe": 75000,
          "ngayChieuGioChieu": "2024-06-10T13:00:00.000Z",
          "danhSachChoNgoi": []
      },
      "phim": {
          "id": 3,
          "maPhim": "c22",
          "tenPhim": "Minions: Sự Trỗi Dậy của Gru",
          "hinhAnh": "https://media-cdn-v2.laodong.vn/storage/newsportal/2022/7/13/1067935/Minions-1-T-01.jpg?w=660",
          "moTa": "Minions: Sự Trỗi Dậy của Gru",
          "trailer": "https://www.youtube.com/embed/dTQXlDV16SY?si=pfybhbMZfKlnOzcH",
          "ngayKhoiChieu": "2024-01-01",
          "dangChieu": true
      }
  }
]

// [
//   {
//       "id": 1,
//       "maRap": "cgv_hung_vuong",
//       "tenRap": "CGV Hùng Vương Plaza",
//       "diaChi": "Tầng 7 | Hùng Vương Plaza, 126 Hồng Bàng, Phường 12, Quận 5, TP. Hồ Chí Minh.",
//       "suatChieu": {
//           "id": 32,
//           "giaVe": 75000,
//           "ngayChieuGioChieu": "2024-06-10T13:00:00.000Z",
//           "danhSachChoNgoi": []
//       },
//       "phim": {
//           "id": 3,
//           "maPhim": "c22",
//           "tenPhim": "Minions: Sự Trỗi Dậy của Gru",
//           "hinhAnh": "https://media-cdn-v2.laodong.vn/storage/newsportal/2022/7/13/1067935/Minions-1-T-01.jpg?w=660",
//           "moTa": "Minions: Sự Trỗi Dậy của Gru",
//           "trailer": "https://www.youtube.com/embed/dTQXlDV16SY?si=pfybhbMZfKlnOzcH",
//           "ngayKhoiChieu": "2024-01-01",
//           "dangChieu": true
//       }
//   },
//   {
//       "id": 2,
//       "maRap": "cgv_vivo",
//       "tenRap": "CGV Vivo City",
//       "diaChi": "Lầu 5, Trung tâm thương mại SC VivoCity - 1058 Nguyễn Văn Linh, Quận 7",
//       "suatChieu": {
//           "id": 32,
//           "giaVe": 75000,
//           "ngayChieuGioChieu": "2024-06-10T13:00:00.000Z",
//           "danhSachChoNgoi": []
//       },
//       "phim": {
//           "id": 3,
//           "maPhim": "c22",
//           "tenPhim": "Minions: Sự Trỗi Dậy của Gru",
//           "hinhAnh": "https://media-cdn-v2.laodong.vn/storage/newsportal/2022/7/13/1067935/Minions-1-T-01.jpg?w=660",
//           "moTa": "Minions: Sự Trỗi Dậy của Gru",
//           "trailer": "https://www.youtube.com/embed/dTQXlDV16SY?si=pfybhbMZfKlnOzcH",
//           "ngayKhoiChieu": "2024-01-01",
//           "dangChieu": true
//       }
//   },
//   {
//       "id": 3,
//       "maRap": "bhd_garden",
//       "tenRap": "BHD STAR THE GARDEN",
//       "diaChi": "Tầng 4, TTTM Garden Shopping Center, Phố Mễ Trì, P.Mỹ Đình 1, Quận Nam Từ Liêm, Hà Nội",
//       "suatChieu": {
//           "id": 32,
//           "giaVe": 75000,
//           "ngayChieuGioChieu": "2024-06-10T13:00:00.000Z",
//           "danhSachChoNgoi": []
//       },
//       "phim": {
//           "id": 3,
//           "maPhim": "c22",
//           "tenPhim": "Minions: Sự Trỗi Dậy của Gru",
//           "hinhAnh": "https://media-cdn-v2.laodong.vn/storage/newsportal/2022/7/13/1067935/Minions-1-T-01.jpg?w=660",
//           "moTa": "Minions: Sự Trỗi Dậy của Gru",
//           "trailer": "https://www.youtube.com/embed/dTQXlDV16SY?si=pfybhbMZfKlnOzcH",
//           "ngayKhoiChieu": "2024-01-01",
//           "dangChieu": true
//       }
//   }
// ]