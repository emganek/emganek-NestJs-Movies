import { IsDateString, IsNumber, IsString } from "class-validator";

export class Showtime{
    @IsString()
    maPhim: string;

    @IsString()
    maRap: string;  

    @IsDateString()
    ngayChieuGioChieu: Date;  

    @IsNumber()
    giaVe: number;
}