import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MovieEntity } from './movie.entity';

@Entity()
export class BannerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => MovieEntity) 
  @JoinColumn() 
  phim: MovieEntity;
}