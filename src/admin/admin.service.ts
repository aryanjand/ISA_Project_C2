import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async deleteStory(token: string, story_id: string): Promise<void> {
        const { user } = await this.jwt.verifyAsync(token);
        if (user.user_privilege !== 'ADMIN') {
            throw new UnauthorizedException('Only admins can delete stories');
        }
        try {
            await this.prisma.story.delete({
                where: { id: parseInt(story_id) },
            });
        } catch (error) {
            throw new NotFoundException('Story not found');
        }
        return;
    }
}
