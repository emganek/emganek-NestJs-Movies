import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import {
  UserLoggedInInfo,
  UserLoggedInWithTokens,
} from '../../user/models/user';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(data: UserLoggedInInfo): Promise<UserLoggedInWithTokens> {
    return {
      id: data.id,
      hoTen: data.hoTen,
      taiKhoan: data.taiKhoan,
      email: data.email,
      maLoaiNguoiDung: data.maLoaiNguoiDung,
      accessToken: await this.jwtService.signAsync({ taiKhoan: data.taiKhoan }),
      hasRefreshToken: true,
      refreshToken: await this.jwtService.signAsync(
        { taiKhoan: data.taiKhoan },
        {
          expiresIn: '3d',
        },
      ),
    };
  }

  async validateUser(
    taiKhoan: string,
    matKhau: string,
  ): Promise<UserLoggedInInfo> {
    const user = await this.userService.getUserByAccountName(taiKhoan);

    if (user?.matKhau !== matKhau) {
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      taiKhoan: user.taiKhoan,
      email: user.email,
      hoTen: user.hoTen,
      maLoaiNguoiDung: user.maLoaiNguoiDung,
    };
  }

  async getRefreshToken(data: UserLoggedInInfo) {
    return {
      content: {
        accessToken: await this.jwtService.signAsync(data),
      },
    };
  }
}
