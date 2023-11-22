// open-ai.service.ts
import { Injectable, Global } from '@nestjs/common';
import OpenAI from 'openai';

@Global()
@Injectable()
export class OpenAiService {
  async openAiResponse(prompt: String): Promise<string> {
    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      console.log(openai);

      const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a story writer.',
          },
          {
            role: 'user',
            content: `Write a story based on these key words keep it short: ${prompt}`,
          },
        ],
        temperature: 0.8,
        max_tokens: 1024,
      });
      const generatedText = response.choices[0].message.content.trim();
      console.log('Generated Text:', generatedText);
      return generatedText;
    } catch (error) {
      console.error('Error in openAiResponse:', error);
      throw new Error('Error generating response from OpenAI API');
    }
  }
}
