import { Uuid } from 'src/@core/value-object';
import { Product } from '../../product/product.domain';
import { Decimal } from '@prisma/client/runtime/library';

export type InventoryProps = {
  id: string | Uuid;
  product: Product;
  quantity: Decimal;
  minimum_stock?: Decimal;
  alert_on_low_stock: boolean;
  created_at: Date;
  updated_at: Date;
};

export type CreateInventoryCommand = {
  product: Product;
  quantity: Decimal;
  minimum_stock?: Decimal;
  alert_on_low_stock: boolean;
};

export type UpdateInventoryCommand = {
  minimum_stock?: number;
  alert_on_low_stock?: boolean;
};
