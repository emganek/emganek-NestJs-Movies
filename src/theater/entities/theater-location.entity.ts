import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { TheaterChainEntity } from './theater-chain.entity';

@Entity()
export class TheaterLocationEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  maRap: string;

  @Column()
  tenRap: string;

  @Column()
  diaChi: string;

  @ManyToOne(() => TheaterChainEntity)
  heThongRap: string;
}
