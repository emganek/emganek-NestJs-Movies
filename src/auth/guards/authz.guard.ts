import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from '../../enums/enums';

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const role = request['user'].maLoaiNguoiDung.value;

    if (role !== UserRole.QuanTri){
      throw new UnauthorizedException();
    }

    return true;
  }
}
