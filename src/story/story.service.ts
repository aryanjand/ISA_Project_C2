import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidationException } from '../common';
import { JwtService } from '@nestjs/jwt';
import { STORY_MESSAGES } from './story.constants';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Injectable()
export class StoryService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async getAllStories(token: string) {
    try {
      const {user} = await this.jwt.verifyAsync(token);
      if (user.user_privilege !== 'ADMIN') {
        throw new ValidationException(STORY_MESSAGES.SOMETHING_WENT_WRONG_STORY);
      }
      const story = await this.prisma.story.findMany();
      return story;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new HttpException('Token Expired', 401)
      }
      if (err.code === 'P2002') {
        throw new ValidationException(STORY_MESSAGES.CREDENTIALS_TAKEN_STORY);
      }
      throw new ValidationException(STORY_MESSAGES.SOMETHING_WENT_WRONG_STORY);
    }
  }
}
