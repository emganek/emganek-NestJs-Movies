import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../enums/enums';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

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
}