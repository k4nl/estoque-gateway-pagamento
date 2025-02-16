import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class PublisherManager implements OnModuleInit, OnModuleDestroy {
  private client: ClientProxy;

  async send<T>(channel: T, message: any) {
    return this.client.emit(channel, message);
  }

  async onModuleInit() {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
      },
    });

    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }
}
