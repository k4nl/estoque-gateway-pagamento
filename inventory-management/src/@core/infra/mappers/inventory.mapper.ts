import { Inventory as InventoryModel, Prisma } from '@prisma/client';
import { Inventory as InventoryDomain } from 'src/@core/domain/inventory/inventory.domain';
import { ProductMapper } from './product.mapper';

export class InventoryMapper {
  public toDatabase(inventory: InventoryDomain): InventoryModel {
    return {
      id: inventory.getId(),
      product_id: inventory.getProduct().getId(),
      alert_on_low_stock: inventory.getAlertOnLowStock(),
      quantity: inventory.getQuantity(),
      minimum_stock: inventory.getMinimumStock(),
      created_at: inventory.getCreatedAt(),
      updated_at: inventory.getUpdatedAt(),
    };
  }

  public toDomain(inventory: InventoryModelExtended): InventoryDomain {
    return new InventoryDomain({
      id: inventory.id,
      product: ProductMapper.toDomain(inventory.product),
      alert_on_low_stock: inventory.alert_on_low_stock,
      quantity: inventory.quantity,
      minimum_stock: inventory.minimum_stock,
      created_at: inventory.created_at,
      updated_at: inventory.updated_at,
    });
  }
}

type InventoryModelExtended = Prisma.InventoryGetPayload<{
  include: {
    product: {
      include: {
        digital_product: true;
        pyhsical_product: true;
        categories: true;
        product_batches: true;
      };
    };
  };
}>;
