import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class ApiController {
  @Get('colors')
  getColors() {
    return { colors: ['#FF5733', '#33FF57', '#3357FF'] };
  }
}
