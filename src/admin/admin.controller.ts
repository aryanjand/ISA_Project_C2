import {
    Controller,
    ForbiddenException,
    Delete,
    Param,
    NotFoundException,
    UseGuards,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags, ApiNotFoundResponse } from '@nestjs/swagger';
import { AuthGuard } from '../common';
import { Story } from '@prisma/client';
import { AdminService } from './admin.service';
import { StoryDto } from './dto';


@ApiTags('admin')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    // ... Other routes and methods

    @UseGuards(AuthGuard)
    @Delete('deleteStory/:userId/:storyId') // Update the route to accept both userId and storyId
    @ApiResponse({
        status: 200,
        description: 'Delete a story',
        type: StoryDto,
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Story not found' })
    async deleteStory(@Param('userId') userId: string, @Param('storyId') storyId: string): Promise<Story> {
        const deletedStory = await this.adminService.deleteStory(userId, storyId);
        if (!deletedStory) {
            throw new NotFoundException('Story not found');
        }
        return deletedStory;
    }
    
}
