import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import Redis from 'ioredis';
import { ReservationEventsEnum } from 'src/application/product-reservation/events/events.enum';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly redisClient: Redis;
  private readonly subscriber: Redis;

  private readonly logger = new Logger(RedisService.name);
  private readonly RESERVATION_CHANNEL = 'reservation-events';

  constructor(private readonly eventEmitter: EventEmitter2) {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });

    // Criando uma conexão separada para escutar eventos
    this.subscriber = this.redisClient.duplicate();
  }

  async onModuleInit() {
    this.redisClient.on('connect', () => {
      this.logger.log('Redis connected');
    });

    this.redisClient.on('error', (err) => {
      this.logger.error('Redis connection error:', err);
    });

    // Ativar eventos de expiração no Redis
    await this.redisClient.config('SET', 'notify-keyspace-events', 'Ex');

    // Inscrevendo-se nos eventos de expiração
    this.subscriber.psubscribe('__keyevent@0__:expired');

    this.subscriber.on('pmessage', (pattern, channel, expiredKey) => {
      this.logger.log(`Chave expirada: ${expiredKey}`);

      // Emitindo um evento interno para ser tratado em outra parte da aplicação
      this.eventEmitter.emit('reservation.expired', { key: expiredKey });
    });

    this.subscriber.subscribe(this.RESERVATION_CHANNEL);

    this.subscriber.on('message', (channel, message) => {
      if (channel === this.RESERVATION_CHANNEL) {
        let eventData: any;

        try {
          eventData = JSON.parse(message);
        } catch {
          this.logger.error('Error parsing message:', message);
          return;
        }

        // Dispara evento interno baseado no tipo recebido
        if (eventData.event === ReservationEventsEnum.RELEASED) {
          this.eventEmitter.emit(ReservationEventsEnum.RELEASED, eventData);
        }

        if (eventData.event === ReservationEventsEnum.CANCELED) {
          this.eventEmitter.emit(ReservationEventsEnum.CANCELED, eventData);
        }
      }
    });
  }

  async onModuleDestroy() {
    await this.redisClient.quit();
    await this.subscriber.quit();
    this.logger.log('Redis connections closed');
  }

  getReservationChannel(): string {
    return this.RESERVATION_CHANNEL;
  }

  getClient(): Redis {
    return this.redisClient;
  }

  async set(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async setKeyWithExpireTime({
    key,
    value,
    seconds,
  }: {
    key: string;
    value: string;
    seconds: number;
  }): Promise<void> {
    await this.redisClient.set(key, value, 'EX', seconds);
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async delete(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  async lock(key: string): Promise<boolean> {
    const result = await this.redisClient.set(key, 'locked', 'NX');
    return result !== 'OK';
  }

  async unlock(key: string): Promise<number> {
    return this.redisClient.del(key);
  }
}
