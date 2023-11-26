import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { HEALTH_MESSAGES } from './health.constants';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  public constructor(private health: HealthCheckService) {}

  @Get()
  @ApiOperation({ summary: HEALTH_MESSAGES.HEALTH_SUMMARY })
  @ApiResponse({
    status: 200,
    description: HEALTH_MESSAGES.HEALTH_DESCRIPTION,
  })
  @HealthCheck()
  check() {
    return this.health.check([]);
  }
}
