import { Global, Module } from '@nestjs/common';
import { TriggersService } from './triggers.service';

@Global()
@Module({
  providers: [TriggersService],
  exports: [TriggersService],
})
export class TriggersModule {}
