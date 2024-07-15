import {
  CanActivate,
  ExecutionContext,
  Injectable
} from '@nestjs/common';
import { UserRole } from '../../enums/enums';
import { ForbiddenException } from '../../system/exceptions/forbidden.exception';

@Injectable()
export class AuthzGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const role = request['user'].maLoaiNguoiDung.value;

    if (role !== UserRole.QuanTri){
      throw new ForbiddenException();
    }

    return true;
  }
}
