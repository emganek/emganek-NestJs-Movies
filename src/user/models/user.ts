import { UserRoleEntity } from '../entities/user-role.entity';

export interface UserLoggedInInfo {
  email: string;
  hoTen: string;
  taiKhoan: string;
  maLoaiNguoiDung: UserRoleEntity | number;
  id: string;
}

export interface UserLoggedInWithTokens extends UserLoggedInInfo {
  accessToken: string;
  hasRefreshToken: boolean;
  refreshToken: string;
}
