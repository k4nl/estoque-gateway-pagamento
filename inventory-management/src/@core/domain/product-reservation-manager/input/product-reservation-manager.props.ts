import { Decimal } from '@prisma/client/runtime/library';
import { Product } from '../../product/product.domain';
import { ProductBatch } from '../../product-batch/product-batch.domain';
import { ProductReservation } from '../../product-reservation/product-reservation.domain';

export type ReserveProductReservationManagerCommand = {
  product: Product;
  reservation_id: string;
  quantity: Decimal;
  batch: ProductBatch;
};

export type CancelReservationProductManagerCommand = {
  product: Product;
  product_reservation: ProductReservation;
  batch: ProductBatch;
};

export type ReleaseProductReservationManagerCommand = {
  product_reservation: ProductReservation;
  product: Product;
  batch: ProductBatch;
};
