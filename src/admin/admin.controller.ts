import {
    Controller,
    Delete,
    Param,
    UseGuards,
    Get,
    Request as Req,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags, ApiNotFoundResponse } from '@nestjs/swagger';
import { AuthGuard } from '../common';
import { AdminService } from './admin.service';
import { Request } from 'express';
import { ADMIN_ERROR_MESSAGES } from './admin.constants';
import { RequestsService } from 'src/requests/requests.service';


@ApiTags('admin')
@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService, private readonly requestsServices: RequestsService) { }

    @UseGuards(AuthGuard)
    @Delete('story/:story_id') 
    @ApiResponse({
        status: 200,
        description: 'Delete a story',
    })
    @ApiForbiddenResponse({ description: ADMIN_ERROR_MESSAGES.FORBIDDEN })
    @ApiNotFoundResponse({ description: ADMIN_ERROR_MESSAGES.STORY_NOT_FOUND })
    async deleteStory(@Req() request: Request, @Param('story_id') story_id): Promise<void> {
        this.requestsServices.incrementRequest('/admin/story/:story_id', 'DELETE');
        await this.adminService.deleteStory(request.cookies.token, story_id);
        return;
    }


    @UseGuards(AuthGuard)
    @Get('/endpoints')
    @ApiResponse({
        status: 200,
        description: 'Get all endpoints',
    })
    @ApiForbiddenResponse({ description: ADMIN_ERROR_MESSAGES.FORBIDDEN })
    async getEndpoints(@Req() request: Request): Promise<any> {
        this.requestsServices.incrementRequest('/admin/endpoints', 'GET');
        const isAdmin = this.adminService.isAdmin(request.cookies.token);
        if (!isAdmin) {
            return { error: ADMIN_ERROR_MESSAGES.FORBIDDEN };
        }
        return await this.requestsServices.getRequests();
    }
}
