import { IsString } from "class-validator";

export class UserLogIn{
    @IsString()
    taiKhoan: string;

    @IsString()
    matKhau: string;  
}