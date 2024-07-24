import { Controller, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { WithoutLogIn } from '../system/decorators/auth.decorator';
import { LocalAuthGuard } from './guards/local-stategy.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private sessionService: SessionService,
    private authService: AuthService,
  ) {}

  @WithoutLogIn()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(
    @Request() req: Request,
    @Res({ passthrough: true }) res: ExpressResponse,
  ) {
    const result = await this.authService.login(req['user']);

    await this.sessionService.setUserInfo(req as any, result.taiKhoan);

    const { refreshToken, ...content } = result;

    res.cookie('refreshToken', refreshToken, {
      expires: new Date(new Date().getTime() + 3 * 24 * 3600 * 1000),
      httpOnly: true,
    });
    return {
      content,
    };
  }

  @WithoutLogIn()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-token')
  async refreshToken(@Req() req: Request) {
    return this.authService.getRefreshToken(req['user']);
  }
}
