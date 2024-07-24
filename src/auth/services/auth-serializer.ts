// If passport session is applied so adjust this file
import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

import { SessionService } from './session.service';

@Injectable()
export class AuthSerializer extends PassportSerializer {
  constructor(private readonly sessionService: SessionService) {
    super();
  }
  serializeUser(user: any, done: (err: Error, user: any) => void) {
    done(null, { id: user.id, role: user.role });
  }

  deserializeUser(
    payload: { id: number; role: string },
    done: (err: Error, user: any) => void,
  ) {
    // const user = this.sessionService.findById(payload.id);
    const user = {};
    done(null, user);
  }
}
