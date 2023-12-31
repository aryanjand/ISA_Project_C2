import {
  Controller,
  Get,
  HttpException,
  Query,
  Request as Req,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ModelService } from './model.service';
import { OpenAiService } from '../open-ai/open-ai.service';
import { Request } from 'express';
import { RequestsService } from 'src/requests/requests.service';
import { UserService } from 'src/user/user.service';
import { MODAL_MESSAGES } from './modal.constants';
import { AuthGuard } from 'src/common';

@Controller('model')
export class ModelController {
  constructor(
    private readonly modelService: ModelService,
    private readonly openaiService: OpenAiService,
    private readonly requestService: RequestsService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('GenerateStory')
  @ApiQuery({
    name: MODAL_MESSAGES.DESCRIPTION,
    type: String,
    description: MODAL_MESSAGES.DESCRIPTION_IMAGE,
  })
  async generateTokens(
    @Req() request: Request,
    @Query('description') description: string,
  ): Promise<{ prompt: string }> {
    const user = await this.modelService.getUser(request.cookies.token);
    if (await this.userService.isNoApiCallsLeft(user.id)) {
      throw new HttpException(MODAL_MESSAGES.NO_MORE_API_CALLS, 405);
    }
    const tokens = await this.modelService.identifyTokens(description);
    const generatedText = await this.openaiService.openAiResponse(tokens);
    const success = await this.modelService.storeStory(
      user,
      generatedText,
      description,
    );
    this.requestService.incrementRequest('/model/GenerateStory', 'GET');
    this.userService.incrementTotalRequests(request.cookies.token);
    if (success) {
      return generatedText;
    }
    return null;
  }
}
