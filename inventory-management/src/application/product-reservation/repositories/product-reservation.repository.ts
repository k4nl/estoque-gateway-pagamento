import { Injectable } from '@nestjs/common';
import { ProductReservation } from 'src/@core/domain/product-reservation/product-reservation.domain';
import { ProductReservationMapper } from 'src/@core/infra/mappers/product-reservation.mapper';
import { DatabaseService } from 'src/config/database/database.service';

@Injectable()
export class ProductReservationRepository {
  constructor(private readonly database: DatabaseService) {}

  async findReservationByExternalIdId(
    external_id: string,
  ): Promise<ProductReservation | null> {
    const reservation = await this.database.productReservation.findUnique({
      where: {
        external_id,
      },
      include: { batch: true },
    });

    if (!reservation) {
      return null;
    }

    return ProductReservationMapper.toDomain(reservation);
  }
}
