import { Global, Module } from '@nestjs/common';
import { PublisherManager } from './transporter';

@Global()
@Module({
  providers: [PublisherManager],
  exports: [PublisherManager],
})
export class TransporterModule {}
