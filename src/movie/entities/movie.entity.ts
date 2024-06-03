import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../enums/enums';

@Entity()
export class MovieEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  maPhim: string;

  @Column()
  tenPhim: string;

  @Column()
  hinhAnh: string;

  @Column()
  moTa: string;

  @Column()
  trailer: string;

  @Column()
  ngayKhoiChieu: string;

  @Column()
  dangChieu: boolean;
}