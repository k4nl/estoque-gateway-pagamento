import {
  $Enums,
  Prisma,
  ProductReservation as ProductReservationModel,
} from '@prisma/client';
import { ReservationStatus } from 'src/@core/common/enum';
import { ProductReservation as ProductReservationDomain } from 'src/@core/domain/product-reservation/product-reservation.domain';
import { ProductBatch as ProductBatchDomain } from 'src/@core/domain/product-batch/product-batch.domain';

export class ProductReservationMapper {
  public static toDomain(
    productReservation: ProductReservationModelExtended,
  ): ProductReservationDomain {
    const reservation_status = Object.values(ReservationStatus).find(
      (resevation_type) => resevation_type === productReservation.status,
    );

    if (!reservation_status) {
      throw new Error('Invalid reservation type');
    }

    return new ProductReservationDomain({
      id: productReservation.id,
      product_id: productReservation.product_id,
      reservation_id: productReservation.external_id,
      quantity: productReservation.quantity,
      status: ReservationStatus[reservation_status],
      created_at: productReservation.created_at,
      updated_at: productReservation.updated_at,
      expires_at: productReservation.expires_at,
      batch: new ProductBatchDomain({
        id: productReservation.batch.id,
        quantity: productReservation.batch.quantity,
        expiration_date: productReservation.batch.expiration_date,
        created_at: productReservation.batch.created_at,
        updated_at: productReservation.batch.updated_at,
      }),
    });
  }

  public static toDatabase(
    productReservation: ProductReservationDomain,
  ): ProductReservationModel {
    const reservation_status = Object.values($Enums.ReservationStatus).find(
      (resevation_type) => resevation_type === productReservation.getStatus(),
    );

    if (!reservation_status) {
      throw new Error('Invalid reservation type');
    }

    return {
      id: productReservation.getId(),
      product_id: productReservation.getProductId(),
      external_id: productReservation.getReservationId(),
      quantity: productReservation.getQuantity(),
      status: reservation_status,
      created_at: productReservation.getCreatedAt(),
      updated_at: productReservation.getUpdatedAt(),
      batch_id: productReservation.getBatch().getId(),
      expires_at: productReservation.getExpiresAt(),
    };
  }
}

type ProductReservationModelExtended = Prisma.ProductReservationGetPayload<{
  include: {
    batch: true;
  };
}>;
