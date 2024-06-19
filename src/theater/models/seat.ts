import { IsString } from 'class-validator';

export class Seat {
  soGhe: number;

  userId: string;

  loaiGhe: 'vip' | 'thuong';

  daDat: boolean;

  giaVe: number;

  constructor(_soGhe, _giaVe, _loaiGhe: any = 'thuong') {
    this.soGhe = _soGhe;
    this.giaVe = _giaVe;
    this.loaiGhe = _loaiGhe;
    this.daDat = false;
    this.userId = '';
  }
}
