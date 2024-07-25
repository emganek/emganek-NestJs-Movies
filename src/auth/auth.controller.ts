import { Controller, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { Response as ExpressResponse } from 'express';
import { WithoutLogIn } from '../system/decorators/auth.decorator';
import { UserLoggedInWithTokens } from '../user/models/user';
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
    const loggedInData = await this.authService.generateLoggedInData(
      req['user'],
    );

    this.sessionService.setUserInfo(req as any, loggedInData);

    const { refreshToken, matKhau, ...content } = loggedInData;

    res.cookie('refreshToken', refreshToken, {
      expires: new Date(new Date().getTime() + 3 * 24 * 3600 * 1000),
      httpOnly: true,
    });

    return {
      content,
    };
  }

  @Post('/logout')
  async logout(@Request() req: Request, @Res() res: ExpressResponse) {
    res.clearCookie('refreshToken');
    this.sessionService.deleteBySessionId(
      req as any,
      res,
      'Log out successfully',
    );
  }

  @WithoutLogIn()
  @UseGuards(RefreshTokenGuard)
  @Post('/refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: ExpressResponse) {
    const result = await this.authService.refreshToken(req['user']);

    const loggedInData = req['session']['user-info'] as UserLoggedInWithTokens;
    loggedInData.accessToken = result.content.accessToken;

    this.sessionService.regenerateSession(req as any, res, loggedInData, () => {
      res.send(result);
    });
  }
}
