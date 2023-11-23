import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch';
import { ValidationException } from '../common';
import { PrismaService } from '../prisma/prisma.service';
type EntityData = {
  entity: string;
  score: number;
  index: number;
  word: string;
  start: null; // You can replace null with the appropriate type if needed
  end: null;   // You can replace null with the appropriate type if needed
};

type Context = {
  person: string;
  location?: string;
  organization?: string;
  miscellaneous?: string;
}


@Injectable()
export class ModelService {
  constructor(private prisma: PrismaService) {}

  async identifyTokens(data: String): Promise<string> {
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

      const responseData:EntityData[] = await response.json();
      const context:Context = this.formatContext(responseData);

      return JSON.stringify(context);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  formatContext(data: EntityData[]) {
    let context:Context = {
      person: '',
      location: '',
      organization: '',
      miscellaneous: '',
    };

    data.forEach((entity) => {
      switch (entity.entity) {
        case 'PERSON':
          context.person += this.personFormatter(entity.word);
          break;
        case 'LOCATION':
          context.location += this.locationFormatter(entity.word);
          break;
        case 'ORGANIZATION':
          context.organization += this.organizationFormatter(entity.word);
          break;
        case 'MISCELLANEOUS':
          context.miscellaneous += this.miscellaneousFormatter(entity.word);
          break;
      }
    });
    return context;
  }

  personFormatter = (person: string) => {
    return person.replace(/#+/g, '');
  }
  
  locationFormatter = (location: string) => {
    return location.replace(/#+/g, '');
  }
  
  organizationFormatter = (organization: string) => {
    return organization.replace(/#+/g, ''); 
  }
  
  miscellaneousFormatter = (miscellaneous: string) => {
    return miscellaneous.replace(/#+/g, '');
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
