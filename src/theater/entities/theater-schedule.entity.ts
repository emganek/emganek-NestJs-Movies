import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Seat } from '../models/seat';
import { TheaterLocationEntity } from './theater-location.entity';
import { MovieEntity } from '../../movie/entities/movie.entity';
import { UserEntity } from '../../user/entities/user.entity';

@Entity()
export class TheaterScheduleEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => TheaterLocationEntity)
  rap?: TheaterLocationEntity;

  @Column({nullable: true})
  rapId: string;

  @ManyToOne(() => MovieEntity)
  phim?: MovieEntity;

  @Column({nullable: true})
  phimId: string;

  @Column()
  giaVe: number;

  @Column({ type: 'timestamp' })
  ngayChieuGioChieu: Date;

  @Column({ type: 'json', nullable: true })
  danhSachChoNgoi: Seat[];

  @ManyToMany(() => UserEntity, user => user.lichChieu)
  @JoinTable()
  users: UserEntity[]
}
