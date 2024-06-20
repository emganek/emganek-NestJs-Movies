import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { UserRole } from '../../enums/enums';
import { TheaterScheduleEntity } from '../../theater/entities/theater-schedule.entity';
import { UserRoleEntity } from './user-role.entity';

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

  @ManyToOne(()=> UserRoleEntity)
  @JoinColumn({
    name: 'user_role_id',
    referencedColumnName: 'id',
  })
  maLoaiNguoiDung: UserRoleEntity | number = 1;

  @Column({nullable: true})
  user_role_id: number;


  @ManyToMany(() => TheaterScheduleEntity, schedule => schedule.users)
  lichChieu: TheaterScheduleEntity[]
}