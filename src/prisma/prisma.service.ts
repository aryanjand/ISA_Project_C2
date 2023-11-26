import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Implement OnModuleInit to ensure that the PrismaClient
 * instance is connected to the database before the application starts.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  requests: any;
  story: any;
  async onModuleInit() {
    await this.$connect();
  }
}
