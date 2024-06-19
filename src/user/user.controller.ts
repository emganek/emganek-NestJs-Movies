import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUser } from './models/create-user';
import { WithoutLogIn } from '../system/decorators/auth.decorator';
import { AuthGuard } from '../auth/guards/auth.guard';

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
}
