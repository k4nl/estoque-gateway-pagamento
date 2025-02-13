import { Injectable } from '@nestjs/common';
import { ProductReservationRepository } from '../repositories/product-reservation.repository';
import { ProductReservation } from 'src/@core/domain/product-reservation/product-reservation.domain';

@Injectable()
export class FindReservationByExternalIdService {
  constructor(
    private readonly productReservationRepository: ProductReservationRepository,
  ) {}

  async execute(external_id: string): Promise<ProductReservation> {
    const reservation =
      await this.productReservationRepository.findReservationByExternalIdId(
        external_id,
      );

    if (!reservation) {
      throw new Error(`Reservation id: ${external_id} not found`);
    }

    return reservation;
  }
}
