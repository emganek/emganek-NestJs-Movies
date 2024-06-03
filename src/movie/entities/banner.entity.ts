import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { UserRole } from '../../enums/enums';
import { MovieEntity } from './movie.entity';

@Entity()
export class BannerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(type => MovieEntity) 
  @JoinColumn() 
  phim: MovieEntity;
}