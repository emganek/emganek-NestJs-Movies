import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../enums/enums';
import { ForbiddenException } from '../../system/exceptions/forbidden.exception';
import { AuthGuard } from './auth.guard';

@Injectable()
export class AuthzGuard extends AuthGuard implements CanActivate {
  constructor(reflector: Reflector) {
    super(reflector);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const role = request['user'].maLoaiNguoiDung.value;

    if (role !== UserRole.QuanTri) {
      throw new ForbiddenException();
    }

    return (await super.canActivate(context)) && true;
  }
}
