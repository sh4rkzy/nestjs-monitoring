import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller({
  version: '1',
  path: 'health',
})
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth(): Promise<string | unknown> {
    return this.healthService.getHealthStatus();
  }
}
