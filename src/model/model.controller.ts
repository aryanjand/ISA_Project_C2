import { Controller, Get, Query, Session } from '@nestjs/common';
import { UserSession } from '../common';
import { ApiQuery } from '@nestjs/swagger';
import { ModelService } from './model.service';
import { OpenAiService } from '../open-ai/open-ai.service';

@Controller('model')
export class ModelController {
  constructor(
    private readonly modelService: ModelService,
    private readonly openaiService: OpenAiService,
  ) {}

  @Get('GenerateStoryWithTokens')
  @ApiQuery({
    name: 'description',
    type: String,
    description: 'Description of the User',
  })
  async generateTokensWithStory(
    @Session() session: UserSession,
    @Query('description') description: string,
  ): Promise<string> {
    const tokens = await this.modelService.identifyTokens(description);
    const concatenatedString = tokens.join(' ');
    const sentence = await this.openaiService.openAiResponse(concatenatedString);

    await this.modelService.crateStory(session.user.id, description, sentence);

    return sentence;
  }

  @Get('GenerateTokens')
  @ApiQuery({
    name: 'description',
    type: String,
    description: 'Description of the image',
  })
  async generateTokens(
    @Query('description') description: string,
  ): Promise<string[]> {
    const tokens = await this.modelService.identifyTokens(description);

    return tokens;
  }
}
