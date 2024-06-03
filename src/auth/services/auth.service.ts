import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/services/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserLogIn } from '../models/auth';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  // async validateUser(email: string, password: string){
  //     const user = await this.userService.findByEmail(email);
  //     if (user && user.password === password) {
  //         return user
  //     }
  //     return null
  // }

  async login(data: UserLogIn) {
    const user = await this.userService.getUserByAccountName(data.taiKhoan);

    if (user?.matKhau !== data.matKhau) {
      throw new UnauthorizedException();
    }

    const payload = {
      username: user.taiKhoan,
      password: user.matKhau,
      email: user.email,
      hoTen: user.hoTen,
    };

    return {
      content: {
        hoTen: user.hoTen,
        email: user.email,
        accessToken: await this.jwtService.signAsync(payload),
      },
    };
  }
}
