import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserRole } from '../../enums/enums';
import { TheaterScheduleEntity } from '../../theater/entities/theater-schedule.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  taiKhoan: string;

  @Column()
  hoTen: string;

  @Column()
  email: string;

  @Column()
  matKhau: string;

  @Column()
  soDt: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NguoiDung
  })
  maLoaiNguoiDung: string;

  @ManyToMany(() => TheaterScheduleEntity)
  lichChieu: TheaterScheduleEntity[]
}