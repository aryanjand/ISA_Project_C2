import { Injectable, Global } from '@nestjs/common';
import OpenAI from 'openai';
import { Entity } from 'src/model/types';

@Global()
@Injectable()
export class OpenAiService {
  async openAiResponse(model_tokens: Entity[]): Promise<{prompt: string}> {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const parsed_tokens = model_tokens.map((token) => JSON.stringify(token)).join(', ');
      const prompt = `You are a PG-13 fantasy story writer.\n\nWrite a 150 character fantasy story based on these key words, keep it short: ${parsed_tokens}\n\n###\n\n`;
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a PG-13 fantasy story writer.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 200,
      });
      const generatedText = response.choices[0].message.content.trim();
      return {prompt: generatedText};
    } catch (error) {
      console.error('Error in openAiResponse:', error);
      throw new Error('Error generating response from OpenAI API');
    }
  }
}
