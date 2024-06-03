import { Controller, Get } from '@nestjs/common';
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

  @Get()
  async getAllMovies() {
    const movies = await this.movieService.getMovies();
    
    return {
      content: movies
    };
  }
}
