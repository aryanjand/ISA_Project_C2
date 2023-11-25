import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { OpenAiService } from './open-ai.service';
import { AuthGuard } from 'src/common/guards';

@Controller('open-ai')
export class OpenAiController {
  constructor(private readonly openaiService: OpenAiService) {}

  @UseGuards(AuthGuard)
  @Get('GenerateStory')
  @ApiQuery({
    name: 'Prompt',
    type: String,
    description: 'Give words to make a story',
  })
  async generateStroy(@Query('Prompt') prompt: string): Promise<{prompt: string}> {
    // Assuming your service has a method to generate the image
    const response = await this.openaiService.openAiResponse(prompt);

    // You can return the image data or URL, depending on your needs
    return response;
  }
}
