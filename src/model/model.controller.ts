import { Controller, Get, Query } from '@nestjs/common';
import { ModelService } from './model.service'; // Import your service
import { ApiQuery } from '@nestjs/swagger';

@Controller('model')
export class ModelController {

  constructor(private readonly modelService: ModelService) {}

  @Get('generateImage')
  @ApiQuery({ name: 'description', type: String, description: 'Description of the image' })
  async generateImage(@Query('description') description: string): Promise<String | ArrayBuffer> {
    // Assuming your service has a method to generate the image
    const imageData = await this.modelService.generateImage(description);

    // You can return the image data or URL, depending on your needs
    return imageData;
  }
}
