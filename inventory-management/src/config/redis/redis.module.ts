import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Global()
@Module({
  providers: [RedisService, EventEmitter2],
  exports: [RedisService],
})
export class RedisModule {}
