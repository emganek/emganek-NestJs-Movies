import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Seat } from '../models/seat';
import { TheaterLocationEntity } from './theater-location.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';

@Entity()
export class TheaterScheduleEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => TheaterLocationEntity)
  rap: string;

  @ManyToOne(() => MovieEntity)
  @Column()
  phim: string;

  @Column()
  giaVe: number;

  @Column({ type: 'timestamp' })
  ngayChieuGioChieu: Date;

  @Column({ type: 'json', nullable: true })
  danhSachChoNgoi: Seat[];
}
