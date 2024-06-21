import {
  IsBoolean,
  IsBooleanString,
  IsDateString,
  IsNumber,
  IsNumberString,
  IsString,
} from 'class-validator';
export class UpdateMovie {
  @IsString()
  id: string;

  @IsString()
  tenPhim: string;

  @IsString()
  trailer: string;

  @IsString()
  moTa: string;

  @IsString()
  maPhim: string;

  @IsDateString()
  ngayKhoiChieu: Date;

  @IsBooleanString()
  dangChieu: string;

  @IsBooleanString()
  sapChieu: string;

  @IsBooleanString()
  hot: string;

  @IsNumberString()
  danhGia: number;
}
