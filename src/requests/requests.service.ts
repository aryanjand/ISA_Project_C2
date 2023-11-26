import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  async isEndpointExists(endpoint: string, method: string): Promise<boolean> {
    const endpointExists = await this.prisma.requests.findUnique({
      where: { endpoint, method },
    });
    return !!endpointExists;
  }

  async createEndpoint(endpoint: string, method: string): Promise<boolean> {
    try {
      await this.prisma.requests.create({
        data: {
          endpoint,
          method,
        },
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  async checkEndpoint(endpoint: string, method: string): Promise<boolean> {
    try {
      const isExists = this.isEndpointExists(endpoint, method);
      if (!isExists) {
        await this.createEndpoint(endpoint, method);
      }
    } catch (err) {
      return false;
    }
  }

  async incrementRequest(endpoint: string, method: string): Promise<boolean> {
    try {
      await this.checkEndpoint(endpoint, method);
      await this.prisma.requests.update({
        where: { endpoint, method },
        data: {
          count: {
            increment: 1,
          },
        },
      });
      return true;
    } catch (err) {
      return false;
    }
  }
}
