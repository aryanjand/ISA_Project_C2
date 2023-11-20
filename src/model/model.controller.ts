import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { ModelService } from './model.service';
import { OpenAiService } from 'src/open-ai/open-ai.service';

@Controller('model')
export class ModelController {
  constructor(private readonly modelService: ModelService, private readonly openaiService: OpenAiService,) {}


  @Get('GenerateStoryWithTokens')
  @ApiQuery({ name: 'description', type: String, description: 'Description of the image' })
  async generateImage(@Query('description') description: string): Promise<String | ArrayBuffer> {
    // Assuming your service has a method to generate the image
    const tokens = await this.modelService.identifyTokens(description);

    console.log("Tokens form model ", tokens)
    const sentence = await this.openaiService.openAiResponse(tokens);
    console.log("Story ", sentence)
    // You can return the image data or URL, depending on your needs
    return sentence;
  }
}
