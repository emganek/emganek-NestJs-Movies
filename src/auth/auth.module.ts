import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { jwtConstants } from './auth.constant';
import { AuthController } from './auth.controller';
import { AuthSerializer } from './services/auth-serializer';
import { AuthService } from './services/auth.service';
import { JwtRefreshStrategy } from './services/jwt-refresh.strategy';
import { JwtStrategy } from './services/jwt.strategy';
import { LocalStrategy } from './services/local.strategy';
import { SessionService } from './services/session.service';

@Module({
  controllers: [AuthController],
  imports: [
    // Enable this if passport session is applied
    // PassportModule.register({
    //   session: true,
    // }),
    UserModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10m' },
    }),
  ],
  providers: [
    AuthService,
    SessionService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthSerializer,
  ],
})
export class AuthModule {}
