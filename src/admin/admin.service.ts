import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Story } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async deleteStory(userId: string, storyId: string): Promise<Story> {
        // Fetch user details from token
        const { user } = await this.jwt.verifyAsync(userId);

        // Check if the user is an admin
        if (user.user_privilege !== 'ADMIN') {
            throw new UnauthorizedException('Only admins can delete stories');
        }

        // Fetch the story from the database along with its owner's user_id
        const story = await this.prisma.story.findUnique({
            where: { id: parseInt(storyId) },
            select: { id: true, user_id: true, created_at: true, updated_at: true, user_text: true, story_text: true },
        });

        if (!story) {
            throw new NotFoundException('Story not found');
        }

        // Perform deletion logic here
        await this.prisma.story.delete({ where: { id: parseInt(storyId) } });

        return story;
    }
}
