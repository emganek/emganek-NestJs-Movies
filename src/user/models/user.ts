import { UserRoleEntity } from '../entities/user-role.entity';
import { UserEntity } from '../entities/user.entity';

export interface UserLoggedInInfo {
  email: string;
  hoTen: string;
  taiKhoan: string;
  maLoaiNguoiDung: UserRoleEntity | number;
  id: string;
}

export interface UserLoggedInWithTokens extends UserEntity {
  accessToken: string;
  hasRefreshToken: boolean;
  refreshToken: string;
}

export interface TokenDataEncoded {
  taiKhoan: string;
}
