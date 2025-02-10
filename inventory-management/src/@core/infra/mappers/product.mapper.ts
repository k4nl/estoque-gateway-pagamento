import { Product as ProductDomain } from 'src/@core/domain/product/product.domain';
import { DigitalProduct as DigitalProductDomain } from 'src/@core/domain/product/digital-product.domain';
import { PhysicalProduct as PhysicalProductDomain } from 'src/@core/domain/product/physical-product.domain';
import {
  Product as ProductModel,
  PhysicalProduct as PhysicalProductModel,
  DigitalProduct as DigitalProductModel,
  Inventory as InventoryModel,
  Prisma,
  $Enums,
} from '@prisma/client';
import { Category } from 'src/@core/domain/category/category.domain';
import { Inventory } from 'src/@core/domain/inventory/inventory.domain';
import { ReservationType } from 'src/@core/common/enum';
import { ProductBatch } from 'src/@core/domain/product-batch/product-batch.domain';

export class ProductMapper {
  public static toDatabase(
    product: DigitalProductDomain | PhysicalProductDomain | ProductDomain,
  ): ProductModelExtended | ProductModel {
    if (product instanceof DigitalProductDomain) {
      return this.toDatabaseDigitalProduct(product);
    }

    if (product instanceof PhysicalProductDomain) {
      return this.toDatabasePhysicalProduct(product);
    }

    if (product instanceof ProductDomain) {
      return this.toDatabaseProduct(product);
    }

    throw new Error('Invalid product type');
  }

  public static toDomain(
    product: ProductModelExtended,
  ): ProductDomain | PhysicalProductDomain | DigitalProductDomain {
    if (product.pyhsical_product) {
      return this.toPhysicalProduct(product);
    }

    if (product.digital_product) {
      return this.toDigitalProduct(product);
    }

    return this.toProduct(product);
  }

  private static toPhysicalProduct(
    product: ProductModelExtended,
  ): PhysicalProductDomain {
    const categories = product.categories.map(
      (category) => new Category(category),
    );

    const batches = product.product_batches.map(
      (batch) => new ProductBatch(batch),
    );

    const physical_product = new PhysicalProductDomain({
      id: product.id,
      name: product.name,
      description: product.description,
      categories: new Set(categories),
      inventory: null,
      reservation_type: product.reservation_type as ReservationType,
      created_at: product.created_at,
      updated_at: product.updated_at,
      expiration_date: product.pyhsical_product.expiration_date,
      perishable: product.pyhsical_product.perishable,
      batch: new Set(batches),
    });

    if (product.inventory) {
      const inventory = new Inventory({
        id: product.inventory.id,
        product: physical_product,
        quantity: product.inventory.quantity,
        minimum_stock: product.inventory.minimum_stock,
        alert_on_low_stock: product.inventory.alert_on_low_stock,
        created_at: product.inventory.created_at,
        updated_at: product.inventory.updated_at,
      });

      physical_product.setInventory(inventory);
    }

    return physical_product;
  }

  private static toDigitalProduct(
    product: ProductModelExtended,
  ): DigitalProductDomain {
    const categories = product.categories.map(
      (category) => new Category(category),
    );

    const digital_product = new DigitalProductDomain({
      id: product.id,
      name: product.name,
      description: product.description,
      categories: new Set(categories),
      inventory: null,
      reservation_type: product.reservation_type as ReservationType,
      created_at: product.created_at,
      updated_at: product.updated_at,
      unlimited_inventory: product.digital_product.unlimited_inventory,
    });

    if (product.inventory) {
      const inventory = new Inventory({
        id: product.inventory.id,
        product: digital_product,
        quantity: product.inventory.quantity,
        minimum_stock: product.inventory.minimum_stock,
        alert_on_low_stock: product.inventory.alert_on_low_stock,
        created_at: product.inventory.created_at,
        updated_at: product.inventory.updated_at,
      });

      digital_product.setInventory(inventory);
    }

    return digital_product;
  }

  private static toProduct(product: ProductModelExtended): ProductDomain {
    const categories = product.categories.map(
      (category) => new Category(category),
    );

    const product_domain = new ProductDomain({
      id: product.id,
      name: product.name,
      description: product.description,
      categories: new Set(categories),
      inventory: null,
      reservation_type: product.reservation_type as ReservationType,
      created_at: product.created_at,
      updated_at: product.updated_at,
    });

    if (product.inventory) {
      const inventory = new Inventory({
        id: product.inventory.id,
        product: product_domain,
        quantity: product.inventory.quantity,
        minimum_stock: product.inventory.minimum_stock,
        alert_on_low_stock: product.inventory.alert_on_low_stock,
        created_at: product.inventory.created_at,
        updated_at: product.inventory.updated_at,
      });

      product_domain.setInventory(inventory);
    }

    return product_domain;
  }

  private static toDatabasePhysicalProduct(
    product: PhysicalProductDomain,
  ): ToProductModelExtended {
    const reservation_type = Object.values($Enums.ReservationType).find(
      (resevation_type) =>
        resevation_type === product.getReservationType().toLocaleLowerCase(),
    );

    if (!reservation_type) {
      throw new Error('Invalid reservation type');
    }

    const inventory = product.getInventory();

    return {
      id: product.getId(),
      name: product.getName(),
      description: product.getDescription(),
      reservation_type: reservation_type,
      created_at: product.getCreatedAt(),
      updated_at: product.getUpdatedAt(),
      pyhsical_product: {
        expiration_date: product.getExpirationDate(),
        perishable: product.getPerishable(),
        product_id: product.getId(),
      },
      digital_product: null,
      inventory: inventory
        ? {
            alert_on_low_stock: inventory.getAlertOnLowStock(),
            created_at: inventory.getCreatedAt(),
            id: inventory.getId(),
            minimum_stock: inventory.getMinimumStock(),
            product_id: inventory.getProduct().getId(),
            quantity: inventory.getQuantity(),
            updated_at: inventory.getUpdatedAt(),
          }
        : null,
      categories: Array.from(product.getCategories()).map(
        (category) =>
          new Category({
            id: category.getId(),
            created_at: category.getCreatedAt(),
            name: category.getName(),
            responsible_id: category.getResponsibleId(),
            updated_at: category.getUpdatedAt(),
          }),
      ),
      product_batches: Array.from(product.getBatches()).map(
        (batch) =>
          new ProductBatch({
            id: batch.getId(),
            quantity: batch.getQuantity(),
            created_at: batch.getCreatedAt(),
            updated_at: batch.getUpdatedAt(),
            expiration_date: batch.getExpirationDate(),
          }),
      ),
    };
  }

  private static toDatabaseDigitalProduct(
    product: DigitalProductDomain,
  ): ToProductModelExtended {
    const reservation_type = Object.values($Enums.ReservationType).find(
      (resevation_type) =>
        resevation_type === product.getReservationType().toLocaleLowerCase(),
    );

    if (!reservation_type) {
      throw new Error('Invalid reservation type');
    }

    const inventory = product.getInventory();

    return {
      id: product.getId(),
      name: product.getName(),
      description: product.getDescription(),
      reservation_type: reservation_type,
      created_at: product.getCreatedAt(),
      updated_at: product.getUpdatedAt(),
      digital_product: {
        unlimited_inventory: product.getUnlimitedInventory(),
        product_id: product.getId(),
      },
      categories: Array.from(product.getCategories()).map(
        (category) =>
          new Category({
            id: category.getId(),
            created_at: category.getCreatedAt(),
            name: category.getName(),
            responsible_id: category.getResponsibleId(),
            updated_at: category.getUpdatedAt(),
          }),
      ),
      inventory: inventory
        ? {
            alert_on_low_stock: inventory.getAlertOnLowStock(),
            created_at: inventory.getCreatedAt(),
            id: inventory.getId(),
            minimum_stock: inventory.getMinimumStock(),
            product_id: inventory.getProduct().getId(),
            quantity: inventory.getQuantity(),
            updated_at: inventory.getUpdatedAt(),
          }
        : null,
      pyhsical_product: null,
      product_batches: null,
    };
  }

  private static toDatabaseProduct(product: ProductDomain): ProductModel {
    const reservation_type = Object.values($Enums.ReservationType).find(
      (resevation_type) =>
        resevation_type === product.getReservationType().toLocaleLowerCase(),
    );

    if (!reservation_type) {
      throw new Error('Invalid reservation type');
    }

    return {
      id: product.getId(),
      name: product.getName(),
      description: product.getDescription(),
      reservation_type: reservation_type,
      created_at: product.getCreatedAt(),
      updated_at: product.getUpdatedAt(),
    };
  }
}

type ProductModelExtended = Prisma.ProductGetPayload<{
  include: {
    digital_product: {
      select: {
        unlimited_inventory: boolean;
      };
    };
    pyhsical_product: {
      select: {
        expiration_date: true;
        perishable: true;
      };
    };
    categories: true;
    product_batches: {
      select: {
        id: true;
        quantity: true;
        created_at: true;
        updated_at: true;
        expiration_date: true;
      };
    };
    inventory: {
      select: {
        alert_on_low_stock: true;
        created_at: true;
        id: true;
        minimum_stock: true;
        quantity: true;
        updated_at: true;
      };
    };
  };
}>;

type ToProductModelExtended = ProductModel & {
  digital_product: DigitalProductModel | null;
  pyhsical_product: PhysicalProductModel | null;
  categories: Category[];
  product_batches: ProductBatch[] | null;
  inventory: InventoryModel | null;
};
