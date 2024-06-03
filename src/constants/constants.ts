import { BannerEntity } from '../movie/entities/banner.entity';
import { MovieEntity } from '../movie/entities/movie.entity';
import { UserEntity } from '../user/entities/user.entity';

export const ENTITIES = {
  UserEntity,
  MovieEntity,
  BannerEntity
};

export const CUSTOM_DECORATOR_KEYS= {
  withoutLogin: 'non-login'
}
