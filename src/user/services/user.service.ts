import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUser } from '../models/create-user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async getUsers(){
    return await this.userRepository
      .createQueryBuilder('user')
      .getMany()
  }

  async getUserByAccountName(
    taiKhoan: string,
  ): Promise<undefined | UserEntity> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.taiKhoan = :taiKhoan', { taiKhoan })
      .getOne();
  }

  create(body: CreateUser): Promise<UserEntity> {
    return this.userRepository.save(body);
  }
}
