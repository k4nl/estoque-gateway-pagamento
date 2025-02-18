import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { ReservationStatus } from 'src/@core/common/enum';
import { ProductReservation } from 'src/@core/domain/product-reservation/product-reservation.domain';
import { ProductReservationMapper } from 'src/@core/infra/mappers/product-reservation.mapper';
import { DatabaseService } from 'src/config/database/database.service';
import { ProductReservationMapperExtended } from './repository.types';

@Injectable()
export class ProductReservationRepository {
  constructor(private readonly database: DatabaseService) {}

  async findReservationByExternalIdId(
    external_id: string,
    user_id?: string,
  ): Promise<ProductReservation | null> {
    const reservation = await this.database.productReservation.findUnique({
      where: {
        external_id,
        product: user_id
          ? {
              user_id,
            }
          : undefined,
      },
      include: { batch: true },
    });

    if (!reservation) {
      return null;
    }

    return ProductReservationMapper.toDomain(reservation);
  }

  async findAllReservations(filter: {
    from: Date;
    to: Date;
    limit: number;
    offset: number;
    product_id: string;
    status: ReservationStatus;
  }): Promise<{
    reservations: ProductReservationMapperExtended[];
    total: number;
  }> {
    const reservation_status = filter.status
      ? $Enums.ReservationStatus[filter.status] ||
        new Error('Invalid reservation status')
      : undefined;

    if (reservation_status.constructor === Error) {
      throw reservation_status;
    }

    const where = {
      created_at: {
        gte: filter.from ? filter.from : undefined,
        lte: filter.to ? filter.to : undefined,
      },
      product_id: filter.product_id ? filter.product_id : undefined,
      status:
        typeof reservation_status === 'string' ? reservation_status : undefined,
    };

    const [reservations, total] = await Promise.all([
      this.database.productReservation.findMany({
        where,
        take: filter.limit,
        skip: filter.offset,
        include: { batch: true, product: true },
      }),
      this.database.productReservation.count({ where }),
    ]);

    return {
      reservations: reservations.map((reservation) => {
        const product_reservation =
          ProductReservationMapper.toDomain(reservation);

        return {
          id: product_reservation.getId(),
          reservation_id: product_reservation.getReservationId(),
          bach: {
            id: product_reservation.getBatch().getId(),
            quantity: product_reservation.getBatch().getQuantity(),
            expiration_date: product_reservation.getBatch().getExpirationDate(),
          },
          quantity: product_reservation.getQuantity(),
          status: product_reservation.getStatus(),
          created_at: product_reservation.getCreatedAt(),
          updated_at: product_reservation.getUpdatedAt(),
          product: {
            id: reservation.product_id,
            name: reservation.product.name,
            user_id: reservation.product.user_id,
          },
        };
      }),
      total,
    };
  }
}
