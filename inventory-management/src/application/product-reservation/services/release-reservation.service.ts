import { Injectable } from '@nestjs/common';
import { FindReservationByExternalIdService } from './find-reservation.service';
import { ReserveProductRepository } from '../repositories/reserve-product.repository';
import { ProductRepository } from 'src/application/product/repositories/product.repository';

@Injectable()
export class ReleaseReservationService {
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

    const product_reservation = product.releaseReservation({
      product_reservation: reservation,
      batch,
    });

    await this.reserveProductRepository.releaseReservation(product_reservation);

    return {
      message: `Reservation ${external_id} released successfully`,
    };
  }
}
