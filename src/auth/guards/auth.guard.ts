import {
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard as AuthGuardPassport } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { CUSTOM_DECORATOR_KEYS } from '../../constants/constants';

@Injectable()
export class AuthGuard extends AuthGuardPassport('jwt') {
  constructor( private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): Promise<boolean> | boolean | Observable<boolean> {
    const isNoNeedLogin = this.reflector.get(CUSTOM_DECORATOR_KEYS.withoutLogin, context.getHandler());
    if (isNoNeedLogin) return true;

    return super.canActivate(context);    
  }
}
