import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReservationEventsEnum } from './events.enum';
import { ReservationExpiredEvent } from './reservation-expired.event';
import { PublisherManager } from 'src/config/events/transporter';
import { ProductReservation } from 'src/@core/domain/product-reservation/product-reservation.domain';
import { RedisService } from 'src/config/redis/redis.service';
import { ExpirationHandler } from 'src/@core/utils/expiration-handler';
import { ReleaseReservationService } from '../services/release-reservation.service';
import { CancelReservationService } from '../services/cancel-reservation.service';

@Injectable()
export class ReservationEvents {
  constructor(
    private readonly reservationExpiredEvent: ReservationExpiredEvent,
    private readonly publishManager: PublisherManager,
    private readonly releaseReservationService: ReleaseReservationService,
    private readonly cancelReservationService: CancelReservationService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * Quando uma reserva expira, publica o evento para a API Gateway
   */
  @OnEvent(ReservationEventsEnum.EXPIRED)
  async handleReservationExpiredEvent(payload: ProductReservation) {
    const message = await this.reservationExpiredEvent.execute(
      payload.getReservationId(),
    );

    const expiration_key = `reservation:${payload.getReservationId()}`;

    const isReserved = await this.redisService.get(expiration_key);

    if (isReserved) {
      await this.redisService.delete(expiration_key);
    }

    await this.publishManager.send<string>(
      this.redisService.getReservationChannel(),
      {
        event: ReservationEventsEnum.EXPIRED,
        reservation_id: payload.getReservationId(),
        message,
      },
    );
  }

  /**
   * Quando uma reserva é liberada antes do tempo, remove do Redis e notifica a API Gateway
   */
  @OnEvent(ReservationEventsEnum.RELEASED)
  async handleReservationReleasedEvent(payload: ProductReservation) {
    const expiration_key = `reservation:${payload.getReservationId()}`;

    const isReserved = await this.redisService.get(expiration_key);
    if (!isReserved) {
      throw new Error(
        `Reservation id: ${payload.getReservationId()} does not exist`,
      );
    }

    await this.redisService.delete(expiration_key);

    const message = await this.releaseReservationService.execute(
      payload.getReservationId(),
    );

    await this.publishManager.send<string>(
      this.redisService.getReservationChannel(),
      {
        event: ReservationEventsEnum.RELEASED,
        reservation_id: payload.getReservationId(),
        message,
      },
    );
  }

  /**
   * Quando uma reserva é criada, salva no Redis com tempo de expiração
   */
  @OnEvent(ReservationEventsEnum.RESERVED)
  async handleReservationReservedEvent(payload: ProductReservation) {
    const expiration_key = `reservation:${payload.getReservationId()}`;

    const isReserved = await this.redisService.get(expiration_key);
    if (isReserved) {
      throw new Error(
        `Reservation id: ${payload.getReservationId()} already exists`,
      );
    }

    // Salva no Redis e define o tempo de expiração
    await this.redisService.setKeyWithExpireTime({
      key: expiration_key,
      value: JSON.stringify(payload),
      seconds: ExpirationHandler.transformTimeInSeconds(payload.getExpiresAt()),
    });
  }

  /**
   * Quando uma reserva é cancelada, remove do Redis e notifica a API Gateway
   */
  @OnEvent(ReservationEventsEnum.CANCELED)
  async handleReservationCanceledEvent(payload: ProductReservation) {
    const expiration_key = `reservation:${payload.getReservationId()}`;

    const isReserved = await this.redisService.get(expiration_key);
    if (!isReserved) {
      throw new Error(
        `Reservation id: ${payload.getReservationId()} does not exist`,
      );
    }

    await this.redisService.delete(expiration_key);

    const message = await this.cancelReservationService.execute(
      payload.getReservationId(),
    );

    await this.publishManager.send<string>(
      this.redisService.getReservationChannel(),
      {
        event: ReservationEventsEnum.CANCELED,
        reservation_id: payload.getReservationId(),
        message,
      },
    );
  }
}
