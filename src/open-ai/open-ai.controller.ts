import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { OpenAiService } from './open-ai.service';

@Controller('open-ai')
export class OpenAiController {
  constructor(private readonly openaiService: OpenAiService) {}

  @Get('GenerateStory')
  @ApiQuery({
    name: 'Prompt',
    type: String,
    description: 'Give words to make a story',
  })
  async generateImage(@Query('Prompt') prompt: string): Promise<String> {
    // Assuming your service has a method to generate the image
    const response = await this.openaiService.openAiResponse(prompt);

    // You can return the image data or URL, depending on your needs
    return response;
  }
}
