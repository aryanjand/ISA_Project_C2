import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ValidationException } from '../common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(user: User) {
    try {
      if (user.user_privilege != 'ADMIN') {
        throw new ValidationException('Something went wrong');
      }
      const users = await this.prisma.user.findMany();
      return users;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ValidationException('Credentials taken');
      }
      throw new ValidationException('Something went wrong');
    }
  }

  async getStoryForUser(user: User) {
    try {
      const story = await this.prisma.story.findMany({
        where: {
          user_id: user.id,
        },
      });
      return story;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ValidationException('Credentials taken');
      }
      throw new ValidationException('Something went wrong');
    }
  }
}
