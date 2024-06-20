import { Body, Controller, Delete, Get, Put, Query, UseGuards } from '@nestjs/common';
import { AuthzGuard } from '../auth/guards/authz.guard';
import { UserService } from './services/user.service';
import { UpdateMyAccount, UpdateUserAccount } from './models/update-user';

@UseGuards(AuthzGuard)
@Controller('/api/user-management/')
export class UserManagementController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsersByName(@Query('fullName') fullName: string) {
    const result = await this.userService.getUsersByName(fullName);
    return {
      content: result,
    };
  }

  @Get('account-info')
  async getLoggedInUserInfo(@Query('taiKhoan') taiKhoan: string) {
    const userInfo = await this.userService.getUserByAccountName(taiKhoan);
    return {
      content: userInfo,
    };
  }

  @Put('account-info')
  async updateAccountInfo(
    @Body() body: UpdateUserAccount,
  ) {
    const result = await this.userService.updateUserAccount(body);
    return {
      content: result,
    };
  }

  @Delete('account-info')
  async deleteAccount(
    @Query('taiKhoan') taiKhoan: string,
  ) {
    const result = await this.userService.deleteAccount(taiKhoan);
    return {
      content: result,
    };
  }
}
