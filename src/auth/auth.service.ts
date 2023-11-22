import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UserSession, ValidationException } from '../common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;

  constructor(private prisma: PrismaService, private config: ConfigService) {
    this.saltRounds = this.config.get('SALT_ROUNDS', 12);
  }

  async signIn(session: UserSession, dto: UserDto) {
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

    session.authenticated = true;
    session.user = user;

    return;
  }

  async signUp(session: UserSession, dto: UserDto) {
    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          password: bcrypt.hashSync(dto.password, this.saltRounds),
        },
      });

      delete user.password;

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
}
