import { Decimal } from '@prisma/client/runtime/library';
import { Product } from '../../product/product.domain';
import { ProductBatch } from '../../product-batch/product-batch.domain';

export type ReserveProductReservationManagerCommand = {
  product: Product;
  reservation_id: string;
  quantity: Decimal;
  batch: ProductBatch;
};
