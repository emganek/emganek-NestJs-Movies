// session.config.ts
import RedisStore from "connect-redis";
import * as session from 'express-session';
import Redis from 'ioredis';

export function createSessionConfig() {
  const redisClient = new Redis({
    host: 'localhost',
    port: 6379,
  });

  return session({
    store: new RedisStore({ client: redisClient }),
    secret: 'ssdfjasdl;fjasdlkfasdfasdlkfjasdlkfjasd;lf',
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60 * 24, // 1 day
    },
  });
}