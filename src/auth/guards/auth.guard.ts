import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as AuthGuardPassport } from '@nestjs/passport';
import { CUSTOM_DECORATOR_KEYS } from '../../constants/constants';

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

    // Enable this if password session is applied
    // await super.logIn(context.switchToHttp().getRequest());

    const result = (await super.canActivate(context)) as boolean;

    const request = context.switchToHttp().getRequest();
    
    request['user'] = request.session['user-info'];

    return result;
  }
}
