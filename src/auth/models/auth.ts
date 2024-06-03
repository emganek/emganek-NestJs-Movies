import { IsEmail, IsNumber, IsNumberString, IsString } from "class-validator";

export class UserLogIn{
    @IsString()
    taiKhoan: string;

    @IsString()
    matKhau: string;  
}