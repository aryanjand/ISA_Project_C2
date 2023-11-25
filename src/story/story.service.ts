import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { ValidationException } from '../common';
import { Request } from '@nestjs/common';

@Injectable()
export class StoryService {
  constructor(private prisma: PrismaService) {}

  async getAllStories(user: User) {
    try {
      if (user.user_privilege != 'ADMIN') {
        throw new ValidationException('Something went wrong');
      }
      const story = await this.prisma.story.findMany();
      return story;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ValidationException('Credentials taken');
      }
      throw new ValidationException('Something went wrong');
    }
  }
}
