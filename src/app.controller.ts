import { Controller, Get, Req, Session } from '@nestjs/common';
import { Request } from 'express';
import { AppService } from './services/app.service';
import { WithoutLogIn } from './system/decorators/auth.decorator';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @WithoutLogIn()
  @Get('/create-session')
  createSession(
    @Session() session: Record<string, any>,
    @Req() request: Request,
  ) {
    request.session['user'] = {
      name: 'hiep',
      age: 80
    };
    return session;
  }
}
