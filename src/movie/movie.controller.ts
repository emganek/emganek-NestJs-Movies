import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthzGuard } from '../auth/guards/authz.guard';
import { DateHelper, Helper } from '../helpers/helper';
import { WithoutLogIn } from '../system/decorators/auth.decorator';
import { MovieEntity } from './entities/movie.entity';
import { CreateMovie } from './models/create-movie';
import { UpdateMovie } from './models/update-movie';
import { MovieService } from './services/movie.service';

@Controller('api/movie/')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @WithoutLogIn()
  @Get('banner')
  async getBanner() {
    const banners = await this.movieService.getBanner();

    return {
      content: banners.map((b) => b.phim),
    };
  }

  @WithoutLogIn()
  @Get()
  async getAllMovies(@Query('tenPhim') name: string) {
    const movies = await this.movieService.getMoviesByName(name);

    return {
      content: movies,
    };
  }

  @WithoutLogIn()
  @Get('detail')
  async getMovieById(@Query('MaPhim') maPhim: string) {
    const movies = await this.movieService.getMovieById(maPhim);

    return {
      content: movies,
    };
  }

  @UseGuards(AuthzGuard)
  @Delete()
  async deleteMovieById(@Query('id') id: string) {
    const movies = await this.movieService.deleteMovieById(id);

    return {
      content: movies,
    };
  }

  @UseGuards(AuthzGuard)
  @Put()
  @UseInterceptors(FileInterceptor('File'))
  async createMovie(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() body: CreateMovie,
  ) {
    let data: MovieEntity = {
      ...body,
      ngayKhoiChieu: DateHelper.convertToDatabaseFormat(body.ngayKhoiChieu),
      hot: Helper.parseBooleanStringToBoolean(body.hot),
      dangChieu: Helper.parseBooleanStringToBoolean(body.dangChieu),
      sapChieu: Helper.parseBooleanStringToBoolean(body.sapChieu),
    } as any;

    if (file) data = { ...data, hinhAnh: file.buffer } as any;

    const result = await this.movieService.createMovie(data);

    return {
      content: result,
    };
  }

  @UseGuards(AuthzGuard)
  @Post()
  @UseInterceptors(FileInterceptor('File'))
  async updateMovieById(
    @UploadedFile()
    file: Express.Multer.File,
    @Body() body: UpdateMovie,
  ) {
    let data: MovieEntity = {
      ...body,
      ngayKhoiChieu: DateHelper.convertToDatabaseFormat(body.ngayKhoiChieu),
      hot: Helper.parseBooleanStringToBoolean(body.hot),
      dangChieu: Helper.parseBooleanStringToBoolean(body.dangChieu),
      sapChieu: Helper.parseBooleanStringToBoolean(body.sapChieu),
    } as any;

    if (file) data = { ...data, hinhAnh: file.buffer } as any;

    const result = await this.movieService.updateMovieById(data.id, data);

    return {
      content: result,
    };
  }
}
