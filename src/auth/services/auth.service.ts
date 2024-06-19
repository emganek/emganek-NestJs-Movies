import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
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

    return {
      content: {
        hoTen: user.hoTen,
        email: user.email,
        maLoaiNguoiDung: user.maLoaiNguoiDung,
        accessToken: await this.jwtService.signAsync(user),
      },
    };
  }
}
