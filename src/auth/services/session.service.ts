import { Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from 'src/user/services/user.service';
import { Message } from '../../models/message';

@Injectable()
export class SessionService {
  constructor(private userService: UserService) {}

  setUserInfo(req: Request, data: any) {
    req.session['user-info'] = data;
  }

  async deleteBySessionId(
    req: Request,
    res: Response,
    message = 'successfully',
  ) {
    req.session.destroy((error: Error) => {
      if (error) throw Error;
      res.clearCookie('connect.sid', { path: '/' });
      res.send(new Message(message));
    });
  }

  async regenerateSession(
    req: Request,
    res: Response,
    data: any,
    callback?: () => void,
  ) {
    if (!callback) {
      callback = () => {
        res.send(new Message('successfully'));
      };
    }
    req.session.regenerate(async (error: Error) => {
      if (error) throw Error;

      this.setUserInfo(req, data);

      callback();
    });
  }
}
