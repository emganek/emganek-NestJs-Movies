import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
