import { Injectable } from '@nestjs/common';
import { ProductReservationRepository } from '../repositories/product-reservation.repository';
import { ProductReservation } from 'src/@core/domain/product-reservation/product-reservation.domain';
import { User } from 'src/@core/domain/user/user.domain';

@Injectable()
export class FindReservationByExternalIdService {
  constructor(
    private readonly productReservationRepository: ProductReservationRepository,
  ) {}

  async execute(external_id: string, user?: User): Promise<ProductReservation> {
    const reservation =
      await this.productReservationRepository.findReservationByExternalIdId(
        external_id,
        user.getId(),
      );

    if (!reservation) {
      throw new Error(`Reservation id: ${external_id} not found`);
    }

    return reservation;
  }
}
