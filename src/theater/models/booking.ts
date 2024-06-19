import { Type } from "class-transformer";
import { IsArray, IsDate, IsDateString, IsNumber, IsString, ValidateNested } from "class-validator";

export class Booking{
    @IsNumber()
    maLichChieu: number;

    @IsArray()
    @Type(() => BookingSeat)
    danhSachVe: BookingSeat[];  
}

export class BookingSeat {
  soGhe: number;
  giaVe: number;
}