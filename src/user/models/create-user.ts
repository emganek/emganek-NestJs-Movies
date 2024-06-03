import { IsEmail, IsNumber, IsNumberString, IsString } from "class-validator";

export class CreateUser{
    @IsString()
    taiKhoan: string;

    @IsString()
    hoTen: string;

    @IsString()
    matKhau: string;

    @IsNumberString()
    soDt: string;

    @IsEmail()
    email: string;    
}