import { Injectable } from '@nestjs/common';

@Injectable()
export class ModelService {
  async identifyTokens(data: String): Promise<String> {
    console.log("JSON OBJ to the API ", JSON.stringify({ text: data }));

    const response = await fetch(
      'https://seahorse-app-pq5ct.ondigitalocean.app/',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: data,
        }),
      }
    );
        // Check the correct spelling of "json()" in the following line
      const responseData = await response.json();
      console.log("Response form model line 22 ", responseData)

      let sentence = responseData.map(item => item.word).join(' ');

    return sentence;
  }
}
