import { Controller, Get, Query, Request as Req } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ModelService } from './model.service';
import { OpenAiService } from '../open-ai/open-ai.service';
import {Request} from 'express';
import { RequestsService } from 'src/requests/requests.service';
import { MODAL_MESSAGES } from './modal.constants';

@Controller('model')
export class ModelController {
  constructor(
    private readonly modelService: ModelService,
    private readonly openaiService: OpenAiService,
    private readonly requestService: RequestsService,
  ) {}

  @Get('GenerateStory')
  @ApiQuery({
    name: MODAL_MESSAGES.DESCRIPTION,
    type: String,
    description: MODAL_MESSAGES.DESCRIPTION_IMAGE,
  })
  async generateTokens(
    @Req() request: Request,
    @Query('description') description: string,
  ): Promise<{prompt: string}> {
    const user = await this.modelService.getUser(request.cookies.token);
    if (user.api_calls_left <= 0) {
      return;
    }
    const tokens = await this.modelService.identifyTokens(description);
    const generatedText = await this.openaiService.openAiResponse(tokens);
    const success = await this.modelService.storeStory(user, generatedText, description);
    this.requestService.incrementRequest('/model/GenerateStory', 'GET');
    if (success) {
      return generatedText;
    }
    return null;
  }
}
