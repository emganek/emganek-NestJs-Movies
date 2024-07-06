import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req
} from '@nestjs/common';
import { WithoutLogIn } from '../system/decorators/auth.decorator';
import { Booking } from './models/booking';
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

  @WithoutLogIn()
  @Get('showtime')
  async getShowTimeByMovieId(@Query('MaPhim') movieCode: string) {
    const schedule = await this.theaterService.getShowTimeByMovieCode(movieCode);
    return {
      content:  {
        heThongRapChieu: schedule 
      },
    };
  }

  
  @Get('booking')
  async getInformationForBooking(@Query('MaLichChieu') scheduleId: string) {
    const info = await this.theaterService.getInformationForBooking(scheduleId);
    return {
      content:  info
    };
  }

  @Post('booking')
  async bookingSchedule(@Body() body: Booking, @Req() request:Request) {
    const info = await this.theaterService.bookingSchedule(request['user'], body);
    
    return {
      content:  null
    };
  }
}
