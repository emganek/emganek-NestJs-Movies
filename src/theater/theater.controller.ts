import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { Showtime } from './models/showtime';
import { TheaterService } from './services/theater.service';

@Controller('/api/theater/')
export class TheaterController {
  constructor(private theaterService: TheaterService) {}

  @Get()
  async getTheaterChains() {
    const theaterChains = await this.theaterService.getTheaterChains();
    return {
      content: theaterChains,
    };
  }

  @Get('location')
  async getLocationByTheaterId(
    @Query('maHeThongRap') theaterChainCode: string,
  ) {
    const theaterLocations =
      await this.theaterService.getLocationByTheaterChainCode(theaterChainCode);
    return {
      content: theaterLocations,
    };
  }

  @Post('schedule')
  async createSchedule(@Body() body: Showtime) {
    const schedule = await this.theaterService.createShowTime(body);
    return {
      content: schedule,
    };
  }

  @Get('showtime')
  async getShowTimeByMovieId(@Query('MaPhim') movieCode: string) {
    const schedule = await this.theaterService.getShowTimeByMovieCode(movieCode);
    return {
      content:  {
        heThongRapChieu: schedule 
      },
    };
  }
}
