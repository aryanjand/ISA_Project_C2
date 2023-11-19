import { User } from '@prisma/client';
import { Session } from 'express-session';

export interface UserSession extends Session {
  authenticated: boolean;
  user: User;
}
