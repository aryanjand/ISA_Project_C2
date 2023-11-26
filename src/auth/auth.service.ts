import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { ValidationException } from '../common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { AUTH_MESSAGES } from '../auth/auth.constants';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {
    this.saltRounds = this.config.get('SALT_ROUNDS', 12);
  }

  validateToken(token: string) {
    return this.jwt.verify(token, {
      secret: process.env.JWT_SECRET_KEY,
    });
  }

  async signIn(dto: UserDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new ValidationException(
        AUTH_MESSAGES.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isValid = bcrypt.compareSync(dto.password, user.password);
    if (!isValid) {
      throw new ValidationException(
        AUTH_MESSAGES.INVALID_CREDENTIALS,
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete user.password;

    const token = await this.jwt.signAsync({ user });
    const cookieName = this.config.get<string>(
      AUTH_MESSAGES.TOKEN_NAME_TEXT,
      process.env.TOKEN_NAME,
    );
    res.cookie(cookieName, token, {
      path: '/',
      httpOnly: process.env.NODE_ENV === AUTH_MESSAGES.PRODUCTION,
      secure: process.env.NODE_ENV === AUTH_MESSAGES.PRODUCTION,
      maxAge: 1000 * 60 * 60, // 1 hour
    });
    const userBundle = {
      username: user.username,
      privilege: user.user_privilege,
      api_calls: user.api_calls_left,
    };
    return { success: true, user: userBundle };
  }

  async signUp(dto: UserDto, res: Response) {
    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          password: await bcrypt.hashSync(dto.password, this.saltRounds),
        },
      });

      delete user.password;

      const token = await this.jwt.signAsync({ user });
      res.cookie(
        this.config.get<string>(
          AUTH_MESSAGES.TOKEN_NAME_TEXT,
          process.env.TOKEN_NAME,
        ),
        token,
        {
          path: '/',
          httpOnly: process.env.NODE_ENV == AUTH_MESSAGES.PRODUCTION,
          secure: process.env.NODE_ENV === AUTH_MESSAGES.PRODUCTION,
          maxAge: 1000 * 60 * 60, // 1 hour
        },
      );
      const userBundle = {
        username: user.username,
        privilege: user.user_privilege,
        api_calls: user.api_calls_left,
      };
      return { success: true, user: userBundle };
    } catch (err) {
      console.error(err);
      if (err.code === 'P2002') {
        throw new ValidationException(AUTH_MESSAGES.CREDENTAILS_TAKEN);
      }
      throw new ValidationException(AUTH_MESSAGES.SOMETHING_WENT_WRONG);
    }
  }

  async signOut(token: string, res: Response) {
    if (!token) return;
    try {
      const cookieName = this.config.get<string>(
        AUTH_MESSAGES.TOKEN_NAME_TEXT,
        process.env.TOKEN_NAME,
      );

      res.clearCookie(cookieName, {
        path: '/',
        httpOnly: process.env.NODE_ENV === AUTH_MESSAGES.PRODUCTION,
        secure: process.env.NODE_ENV === AUTH_MESSAGES.PRODUCTION,
      });

      await this.prisma.expiredJwt.create({
        data: {
          token,
        },
      });

      return;
    } catch (err) {
      if (err.code === 'P2002') {
        return;
      }
      throw new InternalServerErrorException(err.message);
    }
  }

  async session(token: string) {
    if (!token) {
      throw new HttpException(AUTH_MESSAGES.NO_TOKEN, 403);
    }
    try {
      const info = await this.jwt.verifyAsync(token);
      const user = {
        username: info.user.username,
        privilege: info.user.user_privilege,
        api_calls: info.user.api_calls_left,
      };
      return { authenticated: true, user };
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new HttpException(AUTH_MESSAGES.TOKEN_EXPIRED, 401);
      }
    }
  }
}
