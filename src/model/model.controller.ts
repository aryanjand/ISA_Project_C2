import { Controller, Get, Query, Request as Req } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ModelService } from './model.service';
import { OpenAiService } from '../open-ai/open-ai.service';
import {Request} from 'express';

@Controller('model')
export class ModelController {
  constructor(
    private readonly modelService: ModelService,
    private readonly openaiService: OpenAiService,
  ) {}

  @Get('GenerateStory')
  @ApiQuery({
    name: 'description',
    type: String,
    description: 'Description of the image',
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
    const generatedText = await this.openaiService.openAiResponse(tokens.join(' '));
    const success = await this.modelService.storeStory(user, generatedText, description);
    if (success) {
      return generatedText;
    }
    return null;
  }
}
