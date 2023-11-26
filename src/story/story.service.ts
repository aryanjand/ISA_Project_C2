import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidationException } from '../common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class StoryService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async getAllStories(token: string) {
    try {
      const {user} = await this.jwt.verifyAsync(token);
      if (user.user_privilege !== 'ADMIN') {
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
