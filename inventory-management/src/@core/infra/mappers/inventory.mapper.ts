import { Inventory as InventoryModel, Prisma } from '@prisma/client';
import { Inventory as InventoryDomain } from 'src/@core/domain/inventory/inventory.domain';
import { ProductMapper } from './product.mapper';

export class InventoryMapper {
  public static toDatabase(inventory: InventoryDomain): InventoryModel {
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

  public static toDomain(inventory: InventoryModelExtended): InventoryDomain {
    const product = ProductMapper.toDomain({
      categories: inventory.product.categories,
      created_at: inventory.product.created_at,
      description: inventory.product.description,
      id: inventory.product.id,
      digital_product: inventory.product.digital_product,
      name: inventory.product.name,
      inventory: inventory,
      product_batches: inventory.product.product_batches,
      physical_product: inventory.product.physical_product,
      reservation_type: inventory.product.reservation_type,
      updated_at: inventory.product.updated_at,
      user: inventory.product.user,
      user_id: inventory.product.user_id,
    });

    return new InventoryDomain({
      id: inventory.id,
      product,
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
        physical_product: true;
        categories: {
          select: {
            category: true;
          };
        };
        product_batches: true;
        user: true;
      };
    };
  };
}>;
