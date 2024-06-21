import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WithoutLogIn } from '../system/decorators/auth.decorator';
import { MovieService } from './services/movie.service';
import { AuthzGuard } from '../auth/guards/authz.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateMovie } from './models/update-movie';
import { MovieEntity } from './entities/movie.entity';
import { DateHelper, Helper } from '../helpers/helper';

@Controller('api/movie/')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Get('banner')
  async getBanner() {
    const banners = await this.movieService.getBanner();

    return {
      content: banners.map((b) => b.phim),
    };
  }

  @WithoutLogIn()
  @Get()
  async getAllMovies() {
    const movies = await this.movieService.getMovies();

    return {
      content: movies,
    };
  }

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
  @Post()
  @UseInterceptors(FileInterceptor('File'))
  async updateMovieById(
    @UploadedFile(
    )
    file: Express.Multer.File,
    @Body() body: UpdateMovie,
  ) {
    console.log(typeof body.hot === 'boolean');
    let data:MovieEntity = {...body, ngayKhoiChieu: DateHelper.convertToDatabaseFormat(body.ngayKhoiChieu), hot: Helper.parseBooleanStringToBoolean(body.hot), dangChieu: Helper.parseBooleanStringToBoolean(body.dangChieu), sapChieu: Helper.parseBooleanStringToBoolean(body.sapChieu)} as any;

    if (file) data = {...data, hinhAnh: file.buffer} as any;

    const result = await this.movieService.updateMovieById(data.id, data);

    return {
      content: result,
    };
  }
}
