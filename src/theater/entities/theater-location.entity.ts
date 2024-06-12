import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import { TheaterChainEntity } from './theater-chain.entity';
import { TheaterScheduleEntity } from './theater-schedule.entity';

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

  @OneToMany(() =>TheaterScheduleEntity, schedule => schedule.rap )
  suatChieu: TheaterScheduleEntity[];
}
