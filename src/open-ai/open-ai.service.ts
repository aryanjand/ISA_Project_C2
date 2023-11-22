// open-ai.service.ts
import { Injectable, Global } from '@nestjs/common';

const endpoint = 'https://api.openai.com/v1/engines/gpt-3.5-turbo/completions';

@Global()
@Injectable()
export class OpenAiService {
  async openAiResponse(prompt: String): Promise<string> {
    const data = {
      prompt: `Create a Dungeons and Dragons story based on these details I'll be providing: ${prompt}`,
      max_tokens: 200,
    };

    console.log(data);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          `OpenAI API request failed with status: ${response.status}`,
        );
      }

      const result = await response.json();

      if (
        !result.choices ||
        result.choices.length === 0 ||
        !result.choices[0].text
      ) {
        throw new Error('Invalid response format from OpenAI API');
      }

      const generatedText = result.choices[0].text.trim();
      console.log(
        'Response from GPT ',
        result,
        '\nGenerated Text: ',
        generatedText,
      );
      return generatedText;
    } catch (error) {
      console.error('Error in openAiResponse:', error);
      throw new Error('Error generating response from OpenAI API');
    }
  }
}
