import { Injectable } from '@nestjs/common';
import { User } from 'src/@core/domain/user/user.domain';
import { Decimal } from '@prisma/client/runtime/library';
import { ProductReservationRepository } from 'src/application/product-reservation/repositories/product-reservation.repository';
import { ReserveProductRepository } from '../../product-reservation/repositories/reserve-product.repository';
import { GetProductService } from 'src/application/product/services';
import { ProductReservationDTO } from '../dto/product-reservation.dto';
import { PublisherManager } from 'src/config/events/transporter';
import { ReservationEventsEnum } from '../events/events.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ReserveProductService {
  constructor(
    private readonly getProductService: GetProductService,
    private readonly productReservationRepository: ProductReservationRepository,
    private readonly reserveProductRepository: ReserveProductRepository,
    private readonly publisherManager: PublisherManager,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async execute(
    reserveProductDTO: ProductReservationDTO,
    product_id: string,
    user: User,
  ) {
    const product = await this.getProductService.execute(product_id, user);

    const is_reserverd =
      await this.productReservationRepository.findReservationByExternalIdId(
        reserveProductDTO.reservation_id,
      );

    if (is_reserverd) {
      throw new Error(
        `Reservation id: ${reserveProductDTO.reservation_id} already exists`,
      );
    }

    const productBatch = product.getBatchById(reserveProductDTO.batch_id);

    const product_reservation = product.reserve({
      batch: productBatch,
      quantity: new Decimal(reserveProductDTO.quantity),
      reservation_id: reserveProductDTO.reservation_id,
      minutes_to_expire: reserveProductDTO.minutes_to_expire,
    });

    await this.reserveProductRepository.saveReservation(
      product_reservation,
      productBatch,
    );

    this.eventEmitter.emit(ReservationEventsEnum.RESERVED, product_reservation);

    return {
      message: `Product ${product.getName()} reserved successfully`,
      data: {
        reservation_id: reserveProductDTO.reservation_id,
        expires_at: product_reservation.getExpiresAt(),
        status: product_reservation.getStatus(),
      },
    };
  }
}
