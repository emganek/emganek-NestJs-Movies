import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { UserRole } from '../../enums/enums';
import { TheaterScheduleEntity } from '../../theater/entities/theater-schedule.entity';
import { UserEntity } from './user.entity';

@Entity()
export class UserRoleEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  label: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.NguoiDung
  })
  value: UserRole;

  @OneToMany(()=> UserEntity, user => user.maLoaiNguoiDung)
  users: UserEntity[]
}