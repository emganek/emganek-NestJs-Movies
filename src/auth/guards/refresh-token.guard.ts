import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as AuthGuardPassport } from '@nestjs/passport';
import { UserLoggedInWithTokens } from '../../user/models/user';

@Injectable()
export class RefreshTokenGuard extends AuthGuardPassport('jwt-refresh') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies?.['refreshToken'];
    const accessToken = request['headers']['authorization'];
    const loggedInData = request.session['user-info'];

    if (
      !this.checkIfTokenExistsInSession(accessToken, refreshToken, loggedInData)
    )
      return false;

    request.body = {
      ...request.body,
      refreshToken,
    };

    const result = (await super.canActivate(context)) as boolean;

    return result;
  }

  private checkIfTokenExistsInSession(
    token: string,
    refreshToken: string,
    session: UserLoggedInWithTokens,
  ): boolean {
    const storedAccessToken = `Bearer ${session?.accessToken}`;

    if (token === storedAccessToken && refreshToken === session.refreshToken) {
      return true;
    }

    return false;
  }
}
