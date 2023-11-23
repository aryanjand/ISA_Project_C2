import { Controller, Get, Query, Session, UseGuards } from '@nestjs/common';
import { AuthGuard, UserSession } from '../common';
import { ApiQuery } from '@nestjs/swagger';
import { ModelService } from './model.service';
import { OpenAiService } from '../open-ai/open-ai.service';

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
  //   @Session() session: UserSession,
  //   @Query('description') description: string,
  // ): Promise<String | ArrayBuffer> {
  //   // Assuming your service has a method to generate the image
  //   const tokens = await this.modelService.identifyTokens(description)
  //   const sentence = await this.openaiService.openAiResponse(tokens);
  //   await this.modelService.crateStory(session.user.id, description, sentence);
  //   return sentence;
  // }

  @UseGuards(AuthGuard)
  @Get('GenerateTokens')
  @ApiQuery({
    name: 'description',
    type: String,
    description: 'Description of the image',
  })
  async generateTokens(
    @Query('description') description: string,
  ): Promise<String | ArrayBuffer> {
    // Assuming your service has a method to generate the image
    const tokens = await this.modelService.identifyTokens(description);

    // You can return the image data or URL, depending on your needs
    return tokens;
  }
}
