import {
    Controller,
    Delete,
    Param,
    UseGuards,
    Request as Req,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags, ApiNotFoundResponse } from '@nestjs/swagger';
import { AuthGuard } from '../common';
import { AdminService } from './admin.service';
import { Request } from 'express';


@ApiTags('admin')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }


    @UseGuards(AuthGuard)
    @Delete('story/:story_id') 
    @ApiResponse({
        status: 200,
        description: 'Delete a story',
    })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Story not found' })
    async deleteStory(@Req() request: Request, @Param('story_id') story_id): Promise<void> {
        await this.adminService.deleteStory(request.cookies.token, story_id);
        return;
    }
    
}
