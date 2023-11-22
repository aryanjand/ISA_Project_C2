import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { ValidationException } from '../common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModelService {
  constructor(private prisma: PrismaService) {}

  async identifyTokens(data: String): Promise<String> {
    console.log('JSON OBJ to the API ', JSON.stringify({ text: data }));

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
      },
    );
    // Check the correct spelling of "json()" in the following line
    const responseData = await response.json();
    console.log('Response form model line 22 ', responseData);

    let sentence = responseData.map((item) => item.word).join(' ');

    return sentence;
  }

  async crateStory(user_id: number, user_text: string, story: string) {
    try {
      await this.prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          api_calls_left: {
            decrement: 1,
          },
        },
      });

      await this.prisma.story.create({
        data: {
          user_id: user_id,
          user_text: user_text,
          story_text: story,
        },
      });

      return;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ValidationException('Credentials taken');
      }
      throw new ValidationException('Something went wrong');
    }
  }
}
