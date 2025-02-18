import { Injectable } from '@nestjs/common';
import { LowStockTriggerPayload } from 'src/config/database/triggers/trigger.types';
import { PublisherManager } from 'src/config/events/transporter';
import { InventoryEventsEnum } from '../events/inventory.events';

@Injectable()
export class AlertOnLowStockService {
  constructor(private readonly publishManager: PublisherManager) {}

  async execute(payload: LowStockTriggerPayload) {
    await this.publishManager.send<string>(
      InventoryEventsEnum.LOW_STOCK,
      JSON.stringify(payload),
    );
  }
}
