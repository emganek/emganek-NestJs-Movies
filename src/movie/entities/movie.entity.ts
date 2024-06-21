import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MovieEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  maPhim: string;

  @Column()
  tenPhim: string;

  @Column({type: 'mediumblob'})
  hinhAnh: Buffer;

  @Column()
  moTa: string;

  @Column()
  trailer: string;

  @Column({ type: 'date', default: '2024-01-01' })
  ngayKhoiChieu: string;

  @Column({ default: false })
  dangChieu: boolean;

  @Column({ default: false })
  sapChieu: boolean;

  @Column({ default: false })
  hot: boolean;

  @Column()
  danhGia: number;
}
