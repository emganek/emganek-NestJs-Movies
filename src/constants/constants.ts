import { BannerEntity } from '../movie/entities/banner.entity';
import { MovieEntity } from '../movie/entities/movie.entity';
import { TheaterChainEntity } from '../theater/entities/theater-chain.entity';
import { TheaterLocationEntity } from '../theater/entities/theater-location.entity';
import { TheaterScheduleEntity } from '../theater/entities/theater-schedule.entity';
import { UserRoleEntity } from '../user/entities/user-role.entity';
import { UserEntity } from '../user/entities/user.entity';

export const MOVIE_ENTITIES = {
  UserEntity,
  UserRoleEntity,
  MovieEntity,
  BannerEntity,
  TheaterChainEntity,
  TheaterLocationEntity,
  TheaterScheduleEntity
};

export const CUSTOM_DECORATOR_KEYS = {
  withoutLogin: 'non-login',
};

export const DATE_FORMAT = 'yyyy-MM-dd';

export const TIME_STAMP_FORMAT = 'yyyy-MM-dd HH:mm:ss';
