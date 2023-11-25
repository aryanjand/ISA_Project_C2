import { Controller, Get, Query, Session, UseGuards, Request as Req } from '@nestjs/common';
import { AuthGuard, UserSession } from '../common';
import { ApiQuery } from '@nestjs/swagger';
import { ModelService } from './model.service';
import { OpenAiService } from '../open-ai/open-ai.service';
import { Entity } from './types';
import {Request} from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('model')
export class ModelController {
  constructor(
    private readonly modelService: ModelService,
    private readonly openaiService: OpenAiService,
  ) {}

  // @UseGuards(AuthGuard)
  // @Get('GenerateStoryWithTokens')
  // @ApiQuery({
  //   name: 'description',
  //   type: String,
  //   description: 'Description of the User',
  // })
  // async generateTokensWithStory(
  //   @Session() token: UserSession,
  //   @Query('description') description: string,
  // ): Promise<{prompt: string}> {
  //   const tokens = await this.modelService.identifyTokens(description);
  //   const concatenatedString = tokens.join(' ');
  //   const sentence = await this.openaiService.openAiResponse(
  //     concatenatedString,
  //   );

  //   await this.modelService.crateStory(session.user.id, description, sentence.prompt);

  //   return sentence;
  // }

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
