import { Global, Module } from '@nestjs/common';
import { TriggersService } from './triggers.service';
import { AlertOnLowStockService } from 'src/application/inventory/service';

@Global()
@Module({
  providers: [TriggersService, AlertOnLowStockService],
  exports: [TriggersService],
})
export class TriggersModule {}
