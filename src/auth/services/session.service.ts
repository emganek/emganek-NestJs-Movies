import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from 'src/user/services/user.service';

@Injectable()
export class SessionService {
  constructor(private userService: UserService) {}

  async setUserInfo(req: Request, taiKhoan: string) {
    req.session['user-info'] = await this.userService.getUserByAccountName(taiKhoan);
  }
}
