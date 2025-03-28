import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiController } from './api.controller';

@Module({
  imports: [],
  controllers: [AppController, ApiController],
  providers: [AppService],
})
export class AppModule {}
