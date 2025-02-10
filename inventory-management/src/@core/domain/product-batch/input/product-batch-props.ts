import { Uuid } from 'src/@core/value-object';
import { Product } from '../../product/product.domain';

export type ProductBatchProps = {
  id: string | Uuid;
  product: Product;
  quantity: number;
  expiration_date?: Date;
  created_at: Date;
  updated_at: Date;
};

export type CreateProductBatchCommand = {
  product: Product;
  quantity: number;
  expiration_date?: Date;
};
