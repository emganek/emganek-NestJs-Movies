import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({usernameField: 'taiKhoan', passwordField: 'matKhau'});
  }

  async validate(taiKhoan: string, matKhau: string): Promise<any> {
    const user = await this.authService.validateUser(taiKhoan, matKhau);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}