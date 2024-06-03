import { SetMetadata } from '@nestjs/common';
import { CUSTOM_DECORATOR_KEYS } from '../../constants/constants';

export const WithoutLogIn = () => SetMetadata(CUSTOM_DECORATOR_KEYS.withoutLogin, true);
