import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as AuthGuardPassport } from '@nestjs/passport';
import { CUSTOM_DECORATOR_KEYS } from '../../constants/constants';
import { UserLoggedInWithTokens } from '../../user/models/user';

@Injectable()
export class AuthGuard extends AuthGuardPassport('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isNoNeedLogin = this.reflector.get(
      CUSTOM_DECORATOR_KEYS.withoutLogin,
      context.getHandler(),
    );
    if (isNoNeedLogin) return true;

    const request = context.switchToHttp().getRequest();
    const accessToken = request['headers']['authorization'];
    const loggedInData = request.session['user-info'];
    
    if (!this.checkIfTokenExistsInSession(accessToken, loggedInData))
      return false;

    // Enable this if passport session is applied
    // await super.logIn(context.switchToHttp().getRequest());

    const result = (await super.canActivate(context)) as boolean;

    request['user'] = loggedInData;

    return result;
  }

  private checkIfTokenExistsInSession(
    token: string,
    session: UserLoggedInWithTokens,
  ): boolean {
    const storedAccessToken = `Bearer ${session?.accessToken}`;

    if (token === storedAccessToken) {
      return true;
    }

    return false;
  }
}
