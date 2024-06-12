import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MovieEntity {
  @PrimaryGeneratedColumn()
  id: string;

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

  @Column({type: 'date', default: '2024-01-01'})
  ngayKhoiChieu: string;

  @Column()
  dangChieu: boolean;
}