import { Controller, Get, Query } from '@nestjs/common';
import { WithoutLogIn } from '../system/decorators/auth.decorator';
import { MovieService } from './services/movie.service';

@Controller('api/movie/')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Get('banner')
  async getBanner() {
    const banners = await this.movieService.getBanner();
    
    return {
      content: banners.map(b => b.phim)
    };
  }

  @WithoutLogIn()
  @Get()
  async getAllMovies() {
    const movies = await this.movieService.getMovies();
    
    return {
      content: movies
    };
  }

  @Get('detail')
  async getMovieById(@Query('MaPhim') maPhim: string) {
    const movies = await this.movieService.getMovieById(maPhim);
    
    return {
      content: movies
    };
  }
}
