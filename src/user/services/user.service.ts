import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUser } from '../models/create-user';
import { UserRoleEntity } from '../entities/user-role.entity';
import { UpdateMyAccount } from '../models/update-user';
import { TheaterScheduleEntity } from '../../theater/entities/theater-schedule.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserRoleEntity)
    private userRoleRepository: Repository<UserRoleEntity>
  ) {}

  async getUsers() {
    return await this.userRepository.createQueryBuilder('user').getMany();
  }

  async getUserByAccountName(
    taiKhoan: string,
  ): Promise<undefined | UserEntity> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.taiKhoan = :taiKhoan', { taiKhoan })
      .leftJoinAndSelect('user.maLoaiNguoiDung', 'role')
      .getOne();
  }

  async updateUserAccount(
    userData: UpdateMyAccount,
  ): Promise<undefined | UpdateResult> {
    return await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        taiKhoan: userData.taiKhoan,
        hoTen: userData.hoTen,
        email: userData.email,
        matKhau: userData.matKhau,
        soDt: userData.soDt,
        user_role_id: userData.maLoaiNguoiDung,
      })
      .where('id = :id', { id: userData.id })
      .execute();
  }

  async getUserRoles(): Promise<undefined | UserRoleEntity[]> {
    return await this.userRoleRepository.find();
  }

  async getBookedMoviesByUserId(userId: string) {
    const bookedMovies = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.lichChieu', 'schedule')
      .leftJoinAndSelect('schedule.phim', 'phim')
      .where('user.id = :id', {id: userId})
      .orderBy('schedule.ngayChieuGioChieu', 'ASC')
      .getOne();

      bookedMovies.lichChieu.map(schedule =>{
        schedule.danhSachChoNgoi = schedule.danhSachChoNgoi.filter(seat => seat.userId == userId)

        return schedule
      })

      return bookedMovies.lichChieu;
  }

  create(body: CreateUser): Promise<UserEntity> {
    const payload = { ...body, maLoaiNguoiDung: 1 };
    return this.userRepository.save(payload);
  }
}
