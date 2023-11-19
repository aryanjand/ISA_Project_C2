import { Injectable } from '@nestjs/common';

@Injectable()
export class ModelService {
  async generateImage(data: String): Promise<String | ArrayBuffer> {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        headers: {
          Authorization: "Bearer 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",
        },
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    const result = await response.blob();
    console.log("Response from api ", result);

    return "";
  }
    

  

}
