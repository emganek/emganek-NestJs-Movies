import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TheaterLocationEntity } from './theater-location.entity';

@Entity()
export class TheaterChainEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  maHeThongRap: string;

  @Column()
  tenHeThongRap: string;

  @Column({ type: 'varchar' })
  logo: string;

  @OneToMany(() =>TheaterLocationEntity, location => location.heThongRap )
  heThongRap: TheaterLocationEntity[];
}
