import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';
import { AlertOnLowStockService } from 'src/application/inventory/service/alert-low-stock.service';
import { InventoryTrigger } from './low-stock.trigger';
import { LowStockTriggerPayload, TriggerType } from './trigger.types';
import { DatabaseTrigger } from './trigger.enum';

@Injectable()
export class TriggersService implements OnModuleInit, OnModuleDestroy {
  private pgClient: Client;

  constructor(private readonly alertOnLowStockService: AlertOnLowStockService) {
    this.pgClient = new Client({
      connectionString: process.env.DATABASE_URL,
    });
  }

  private async createLowerInventoryTrigger() {
    const query = InventoryTrigger.getLowStockTriggerSQL();

    await this.pgClient.query(query);
  }

  private async createTriggers() {
    await this.createLowerInventoryTrigger();
  }

  private async handleNotification(channel: string, payload: TriggerType) {
    if (
      channel === 'inventory_notifications' &&
      payload.type === DatabaseTrigger.low_stock
    ) {
      await this.alertOnLowStockService.execute(
        payload as LowStockTriggerPayload,
      );
    }
  }

  private async listener() {
    this.pgClient.on('notification', async ({ channel, payload }) => {
      await this.handleNotification(channel, JSON.parse(payload));
    });
  }

  // ON MODULE INIT AND ON MODULE DESTROY

  async onModuleInit() {
    await this.pgClient.connect();
    await this.createTriggers();
    await this.pgClient.query('LISTEN inventory_notifications');
    await this.listener();
  }

  async onModuleDestroy() {
    await this.pgClient.end();
  }
}
