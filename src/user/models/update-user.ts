import { IsEmail, IsNumber, IsNumberString, IsString } from "class-validator";
export class UpdateMyAccount {
    id?: number;

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

    @IsNumber()
    maLoaiNguoiDung: number
}