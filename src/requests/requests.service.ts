import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Requests } from '@prisma/client';

@Injectable()
export class RequestsService {
  constructor(private prisma: PrismaService) {}

  async isEndpointExists(endpoint: string, method: string): Promise<boolean> {
    const request = await this.prisma.requests.findUnique({
      where: { endpoint: endpoint, method: method },
    });
    return request !== null;
  }

  async createEndpoint(endpoint: string, method: string): Promise<boolean> {
    try {
      await this.prisma.requests.create({
        data: {
          endpoint: endpoint,
          method: method,
        },
      });
      return true;
    } catch (err) {
      return false;
    }
  }

  async checkEndpoint(endpoint: string, method: string): Promise<boolean> {
    try {
      const isExists = await this.isEndpointExists(endpoint, method);
      if (!isExists) {
        await this.createEndpoint(endpoint, method);
      }
    } catch (err) {
      return false;
    }
  }

  private async increment(endpoint: string, method: string): Promise<boolean> {
    try {
      await this.prisma.requests.update({
        where: {
          endpoint: endpoint,
          method: method,
        },
        data: {
          total: {
            increment: 1,
          },
        },
      });
    } catch (err) {
      return false;
    }
  }

  async incrementRequest(endpoint: string, method: string): Promise<boolean> {
    try {
      await this.checkEndpoint(endpoint, method);
      await this.increment(endpoint, method);
      return true;
    } catch (err) {
      return false;
    }
  }

  async getRequests(): Promise<Requests[]> {
    try {
      const requests = await this.prisma.requests.findMany();
      return requests;
    } catch (err) {
      return null;
    }
  }
}
