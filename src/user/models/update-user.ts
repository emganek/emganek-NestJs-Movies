import { IsEmail, IsString } from "class-validator";
export class UpdateUserDto {
    @IsString()
    name: string;

    @IsString()
    gender: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string
}