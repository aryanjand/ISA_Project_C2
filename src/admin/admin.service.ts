import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ADMIN_ERROR_MESSAGES } from './admin.constants';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async deleteStory(token: string, story_id: string): Promise<void> {
    try {
      const { user } = await this.jwt.verifyAsync(token);
      if (user.user_privilege !== 'ADMIN') {
        throw new UnauthorizedException(
          ADMIN_ERROR_MESSAGES.UNAUTHORIZED_DELETE,
        );
      }
      await this.prisma.story.delete({
        where: { id: parseInt(story_id) },
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException('Token Expired', 401);
      }
      throw new NotFoundException(ADMIN_ERROR_MESSAGES.STORY_NOT_FOUND);
    }
    return;
  }

  async isAdmin(token: string): Promise<boolean> {
    try {
      const { user } = await this.jwt.verifyAsync(token);
      return user.user_privilege === 'ADMIN';
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new HttpException('Token Expired', 401);
      }
    }
  }
}
