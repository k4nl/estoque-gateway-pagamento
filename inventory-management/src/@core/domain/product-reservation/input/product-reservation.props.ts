import { Decimal } from '@prisma/client/runtime/library';
import { ReservationStatus } from 'src/@core/common/enum';
import { Uuid } from 'src/@core/value-object';
import { ProductBatch } from '../../product-batch/product-batch.domain';

export type ProductReservationProps = {
  id: Uuid | string;
  reservation_id: Uuid | string;
  product_id: Uuid | string;
  quantity: Decimal;
  status: ReservationStatus;
  batch: ProductBatch;
  created_at: Date;
  updated_at: Date;
};

export type CreateProductReservationCommand = {
  reservation_id: Uuid | string;
  batch: ProductBatch;
  product_id: Uuid | string;
  quantity: Decimal;
  status: ReservationStatus;
};
