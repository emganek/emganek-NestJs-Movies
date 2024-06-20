import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MOVIE_ENTITIES } from '../constants/constants';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';
import { UserManagementController } from './user-management.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MOVIE_ENTITIES.UserEntity, MOVIE_ENTITIES.UserRoleEntity])],
  controllers: [UserController, UserManagementController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
