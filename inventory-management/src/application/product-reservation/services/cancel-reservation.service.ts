import { Injectable } from '@nestjs/common';
import { ReserveProductRepository } from '../repositories/reserve-product.repository';
import { ProductRepository } from 'src/application/product/repositories/product.repository';
import { FindReservationByExternalIdService } from './find-reservation.service';

@Injectable()
export class CancelReservationService {
  constructor(
    private readonly findReservationByExternalIdService: FindReservationByExternalIdService,
    private readonly reserveProductRepository: ReserveProductRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(external_id: string) {
    const reservation = await this.findReservationByExternalIdService.execute(
      external_id,
    );

    const product = await this.productRepository.findById(
      reservation.getProductId(),
    );

    const batch = reservation.getBatch();

    const product_reservation = product.cancelReservation({
      product_reservation: reservation,
      batch,
    });

    await this.reserveProductRepository.cancelReservation(
      product_reservation,
      batch,
    );

    return {
      message: `Reservation ${external_id} canceled successfully`,
    };
  }
}
