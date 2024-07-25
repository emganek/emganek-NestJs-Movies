import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/services/user.service';
import { UserEntity } from '../../user/entities/user.entity';
import {
  TokenDataEncoded,
  UserLoggedInWithTokens,
} from '../../user/models/user';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async generateLoggedInData(
    data: UserEntity,
  ): Promise<UserLoggedInWithTokens> {
    return {
      ...data,
      accessToken: await this.jwtService.signAsync({ taiKhoan: data.taiKhoan }),
      hasRefreshToken: true,
      refreshToken: await this.jwtService.signAsync(
        { taiKhoan: data.taiKhoan },
        {
          expiresIn: '15s',
        },
      ),
    };
  }

  async validateUser(taiKhoan: string, matKhau: string): Promise<UserEntity> {
    const user = await this.userService.getUserByAccountName(taiKhoan);

    if (user?.matKhau !== matKhau) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async refreshToken(data: TokenDataEncoded) {
    return {
      content: {
        accessToken: await this.jwtService.signAsync(data),
      },
    };
  }
}
