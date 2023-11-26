import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ADMIN_ERROR_MESSAGES } from './admin.constants';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async deleteStory(token: string, story_id: string): Promise<void> {
        const { user } = await this.jwt.verifyAsync(token);
        if (user.user_privilege !== 'ADMIN') {
            throw new UnauthorizedException(ADMIN_ERROR_MESSAGES.UNAUTHORIZED_DELETE);
        }
        try {
            await this.prisma.story.delete({
                where: { id: parseInt(story_id) },
            });
        } catch (error) {
            throw new NotFoundException(ADMIN_ERROR_MESSAGES.STORY_NOT_FOUND);
        }
        return;
    }
}
