import { Description, Name, Uuid } from 'src/@core/value-object';
import { Inventory } from '../../inventory/inventory.domain';
import { ReservationType } from 'src/@core/common/enum';
import { Category } from '../../category/category.domain';
import { ProductBatch } from '../../product-batch/product-batch.domain';

export type ProductProps = {
  id: string | Uuid;
  name: string | Name;
  description: string | Description;
  categories: Set<Category>;
  inventory: Inventory;
  reservation_type: ReservationType;
  created_at: Date;
  updated_at: Date;
};

export type DigitalProductProps = ProductProps & {
  unlimited_inventory: boolean;
};

export type PhysicalProductProps = ProductProps & {
  expiration_date?: Date;
  perishable: boolean;
  batch: Set<ProductBatch>;
};

export type CreateProductCommand = {
  name: string;
  description: string;
  categories: Set<Category>;
  inventory?: Inventory;
  reservation_type: ReservationType;
};

export type CreateDigitalProductCommand = CreateProductCommand & {
  unlimited_inventory: boolean;
};

export type CreatePhysicalProductCommand = CreateProductCommand & {
  expiration_date?: Date;
  perishable: boolean;
  batch: Set<ProductBatch>;
};
