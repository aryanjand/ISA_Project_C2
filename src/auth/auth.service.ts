import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Response, Request } from 'express';
import { UserSession, ValidationException } from '../common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto';
import { JwtService } from '@nestjs/jwt';

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

  async signIn(session: UserSession, dto: UserDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) {
      throw new ValidationException(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isValid = bcrypt.compareSync(dto.password, user.password);
    if (!isValid) {
      throw new ValidationException(
        'Invalid credentials',
        HttpStatus.UNAUTHORIZED,
      );
    }

    delete user.password;

    const token = await this.jwt.signAsync({ user });
    res.cookie(this.config.get<string>('TOKEN_NAME', 'aryan.sid'), token, {
      httpOnly: process.env.NODE_ENV === 'production',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    session.authenticated = true;
    session.user = user;

    return;
  }

  async signUp(session: UserSession, dto: UserDto, res: Response) {
    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          password: bcrypt.hashSync(dto.password, this.saltRounds),
        },
      });

      delete user.password;

      const token = await this.jwt.signAsync({ user });
      res.cookie(this.config.get<string>('TOKEN_NAME', 'aryan.sid'), token, {
        httpOnly: process.env.NODE_ENV === 'production',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60, // 1 hour
      });

      session.authenticated = true;
      session.user = user;

      return;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ValidationException('Credentials taken');
      }
      throw new ValidationException('Something went wrong');
    }
  }

  async signOut(session: UserSession, res: Response) {
    res.clearCookie('connect.sid');
    session.destroy((err) => {
      if (err) {
        throw new HttpException(err.message, HttpStatus.SERVICE_UNAVAILABLE);
      }
    });
    return;
  }

  async session(token: string) {
    if (!token) {
      return { authenticated: false };
    }
    try {
      await this.jwt.verifyAsync(token);
      return { authenticated: true };
    } catch (err) {
      return { authenticated: false };
    }
  }
}
