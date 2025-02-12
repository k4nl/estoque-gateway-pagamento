import { Description, Name, Uuid } from 'src/@core/value-object';
import { Inventory } from '../../inventory/inventory.domain';
import { ReservationType } from 'src/@core/common/enum';
import { Category } from '../../category/category.domain';
import { ProductBatch } from '../../product-batch/product-batch.domain';
import { User } from '../../user/user.domain';
import { Decimal } from '@prisma/client/runtime/library';

export type ProductProps = {
  id: string | Uuid;
  name: string | Name;
  description: string | Description;
  categories: Set<Category>;
  batch: Set<ProductBatch>;
  inventory: Inventory;
  reservation_type: ReservationType;
  created_at: Date;
  updated_at: Date;
  user: User;
};

export type DigitalProductProps = ProductProps & {
  url: string | URL;
};

export type PhysicalProductProps = ProductProps & {
  expiration_date?: Date;
  perishable: boolean;
};

export type CreateProductCommand = {
  name: string;
  description: string;
  categories: Set<Category>;
  inventory?: Inventory;
  reservation_type: ReservationType;
  user: User;
};

export type CreateDigitalProductCommand = CreateProductCommand & {
  url: string | URL;
};

export type CreatePhysicalProductCommand = CreateProductCommand & {
  expiration_date?: Date;
  perishable: boolean;
  batch: Set<ProductBatch>;
};

export type UpdateProductCommand = {
  description?: string;
  reservation_type?: ReservationType;
};

export type ReserveProductCommand = {
  reservation_id: string;
  quantity: Decimal;
  batch: ProductBatch;
};

export type UpdateDigitalProductCommand = UpdateProductCommand & {
  url?: string | URL;
};
