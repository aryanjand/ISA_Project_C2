import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  public constructor(private health: HealthCheckService) {}

  @ApiTags("Health")
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([]);
  }
}
