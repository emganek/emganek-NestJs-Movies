import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { UserLogIn } from './models/auth';
import { WithoutLogIn } from '../system/decorators/auth.decorator';
import { AuthService } from './services/auth.service';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @WithoutLogIn()
  @Post('/login')
  async login(@Body() req: UserLogIn) {
    console.log("request", req);
    return this.authService.login(req);
  }
}
