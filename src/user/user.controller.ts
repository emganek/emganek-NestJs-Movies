import { Controller, Get, Post, Body, UseGuards, Req, Put } from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUser } from './models/create-user';
import { WithoutLogIn } from '../system/decorators/auth.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UpdateMyAccount } from './models/update-user';

@Controller('/api/user/')
export class UserController {
    constructor(private userService: UserService){}

    @Get()
    async getUsers(){
        const result = await this.userService.getUsers();
        return result;
    }
    
    @WithoutLogIn()
    @Post('register')
    async createUser(@Body() body: CreateUser) {
        const result = await this.userService.create(body);
        return result;
    }

    @Get('account-info')
    async getLoggedInUserInfo(@Req() request: Request){
        const userInfo = await this.userService.getUserByAccountName(request['user'].taiKhoan)
        return {
            content: userInfo
        };
    }

    @Put('account-info')
    async updateAccountInfo(@Body() body: UpdateMyAccount, @Req() request: Request){
        body.id = request['user'].id;
        const result = await this.userService.updateUserAccount(body)
        return {
            content: result
        };
    }

    @Get('booked-movies')
    async getMyBookedMovies(@Req() request: Request){
        const userInfo = await this.userService.getBookedMoviesByUserId(request['user'].id)
        return {
            content: userInfo
        };
    }

    @Get('roles')
    async getUserRoles(){
        const roles = await this.userService.getUserRoles();
        return {
            content: roles
        };
    }
}
