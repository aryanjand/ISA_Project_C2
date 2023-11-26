import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ValidationException } from '../common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {
  }

  async updateStory(story_id: number, story_text: string, token: string) {
    if (!token) {
      return false;
    }
    try {
      const {user} = await this.jwt.verifyAsync(token);
      const story = await this.prisma.story.update({
        where: {
          id: story_id,
          user_id: user.id,
        },
        data: {
          story_text: story_text,
        },
      });
      if (!story) {
        throw new ValidationException('No story found!');
      };
      return true
    } catch (err) {
      return false;
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

  async getUserID(token: string) {
    if (!token) {
      return { authenticated: false };
    }
    try {
      const info = await this.jwt.verifyAsync(token);
      return info.user.id;
    } catch (err) {
      return { authenticated: false };
    }
  }
}
