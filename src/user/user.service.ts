import { HttpException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ValidationException } from '../common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { USER_MESSAGES } from './user.constants';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async decrementApiCallsLeft(user_id: number) {
    try {
      await this.prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          api_calls_left: {
            decrement: 1,
          },
        },
      });
    } catch (err) {
      return false;
    }
    return true;
  }

  async updateStory(story_id: number, story_text: string, token: string) {
    if (!token) {
      throw new HttpException('Token not found', 401);
    }
    try {
      const { user } = await this.jwt.verifyAsync(token);
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
        throw new ValidationException(USER_MESSAGES.NO_STORY_FOUND);
      }
      await this.decrementApiCallsLeft(user.id);
      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new HttpException('Token Expired', 401);
      }
      return false;
    }
  }

  async getStoryForUser(user: number) {
    try {
      const story = await this.prisma.story.findMany({
        where: {
          user_id: user,
        },
      });
      return story;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ValidationException(USER_MESSAGES.CREDENTIALS_TAKEN_USER);
      }
      throw new ValidationException(USER_MESSAGES.SOMETHING_WENT_WRONG_USER);
    }
  }

  async getUserID(token: string) {
    try {
      const info = await this.jwt.verifyAsync(token);
      return info.user.id;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new HttpException('Token Expired', 401);
      }
      return { authenticated: false };
    }
  }

  async getAllUsers() {
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (err) {
      return [];
    }
  }

  async incrementTotalRequests(token: string) {
    try {
      const { user } = await this.jwt.verifyAsync(token);
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          total_requests: {
            increment: 1,
          },
        },
      });
      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new HttpException('Token Expired', 401);
      }
      return false;
    }
  }

  async isNoApiCallsLeft(user_id: number): Promise<Boolean> {
    const user_info = await this.prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });
    return user_info.api_calls_left <= 0;
  }
}
