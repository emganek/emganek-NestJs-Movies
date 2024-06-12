import { IsString } from "class-validator";

export class Seat{
    @IsString()
    soGhe: string;

    @IsString()
    userId: string;  
}