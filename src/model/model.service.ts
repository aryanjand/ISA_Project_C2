import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch';
import { ValidationException } from '../common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModelService {
  constructor(private prisma: PrismaService) {}

  async identifyTokens(data: String): Promise<String> {
    try {
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

      if (!response.ok) {
        throw new InternalServerErrorException('Failed to fetch data from the API');
      }

      const responseData = await response.json();
      console.log('Response from model line 22 ', responseData);

      const entityTypeMap = {
        'B-PER': 'Person',
        'I-PER': 'Person',
        'B-ORG': 'Organization',
        'I-ORG': 'Organization',
        'B-LOC': 'Location',
        'I-LOC': 'Location',
        'B-MISC': 'Miscellaneous',
        'I-MISC': 'Miscellaneous',
      };

      const formattedEntities = responseData.reduce((acc, entity) => {
        const entityType = entityTypeMap[entity.entity];
        if (!acc[entityType]) {
          acc[entityType] = [];
        }
        acc[entityType].push(entity.word);
        return acc;
      }, {});

      const finalObject = Object.keys(formattedEntities).reduce((acc, entityType) => {
        acc[entityType] = formattedEntities[entityType].join(', ');
        return acc;
      }, {});

      return JSON.stringify(finalObject);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
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
