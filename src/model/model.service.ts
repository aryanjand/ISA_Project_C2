import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import fetch from 'node-fetch';
import { ValidationException } from '../common';
import { PrismaService } from '../prisma/prisma.service';
import { Entity } from './types';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { MODAL_MESSAGES } from './modal.constants';

@Injectable()
export class ModelService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async identifyTokens(data: string): Promise<Entity[]> {
    try {
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
        throw new InternalServerErrorException(MODAL_MESSAGES.FAILED_TO_FETCH);
      }

      const responseData = await response.json();

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

      const formattedEntities: Entity[] = [];

      let currentEntity: Entity = { type: '', value: '' };
      responseData.forEach((entity: any) => {
        const entityType = entityTypeMap[entity.entity];
        if (currentEntity.type !== entityType) {
          if (currentEntity.type !== '') {
            formattedEntities.push(currentEntity);
          }
          currentEntity = { type: entityType, value: entity.word };
        } else if (entity.word.includes('#')) {
          currentEntity.value += `${entity.word.replace(/#+/g, '')}`;
        } else {
          currentEntity.value += ` ${entity.word}`;
        }
      });

      formattedEntities.push(currentEntity); // Push the last entity

      return formattedEntities;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUser(token: string) {
    if (!token) {
      return { authenticated: false };
    }
    try {
      const { user } = await this.jwt.verifyAsync(token);
      return user;
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw new HttpException(MODAL_MESSAGES.TOKEN_EXPIRED, 401);
      }
      return { authenticated: false };
    }
  }

  async storeStory(
    user: User,
    generatedText: { prompt: string },
    description: string,
  ) {
    try {
      await this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          api_calls_left: {
            decrement: 1,
          },
        },
      });

      await this.prisma.story.create({
        data: {
          user_id: user.id,
          user_text: description,
          story_text: generatedText.prompt,
        },
      });

      return true;
    } catch (err) {
      if (err.code === 'P2002') {
        throw new ValidationException(MODAL_MESSAGES.CREDENTIALS_TAKEN_MODAL);
      }
      throw new ValidationException(MODAL_MESSAGES.SOMETHING_WENT_WRONG_MODAL);
    }
  }
}
