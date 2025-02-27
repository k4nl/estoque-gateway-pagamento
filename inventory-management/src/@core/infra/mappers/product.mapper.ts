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
import { User } from 'src/@core/domain/user/user.domain';
import { UserType } from 'src/@core/common/user-type';
import { Decimal } from '@prisma/client/runtime/library';

export class ProductMapper {
  public static toDatabase(
    product: DigitalProductDomain | PhysicalProductDomain | ProductDomain,
  ): Omit<ToProductModelExtended, 'user'> {
    if (product instanceof DigitalProductDomain) {
      return ProductMapper.toDatabaseDigitalProduct(product);
    }

    if (product instanceof PhysicalProductDomain) {
      return ProductMapper.toDatabasePhysicalProduct(product);
    }

    if (product instanceof ProductDomain) {
      return ProductMapper.toDatabaseProduct(product);
    }

    throw new Error('Invalid product type');
  }

  public static toDomain(
    product: ProductModelExtended,
  ): ProductDomain | PhysicalProductDomain | DigitalProductDomain {
    if (product.physical_product) {
      return ProductMapper.toPhysicalProduct(product);
    }

    if (product.digital_product) {
      return ProductMapper.toDigitalProduct(product);
    }

    return ProductMapper.toProduct(product);
  }

  private static toPhysicalProduct(
    product: ProductModelExtended,
  ): PhysicalProductDomain {
    const categories = product.categories.map(
      ({ category }) => new Category(category),
    );

    const batches = product.product_batches.map(
      (batch) => new ProductBatch(batch),
    );

    const userType: string = Object.values($Enums.UserType).find(
      (userType) => userType === product.user.user_type,
    );

    if (!userType) {
      throw new Error('Invalid user type');
    }

    const physical_product = new PhysicalProductDomain({
      id: product.id,
      name: product.name,
      description: product.description,
      categories: new Set(categories),
      inventory: null,
      reservation_type: product.reservation_type as ReservationType,
      created_at: product.created_at,
      updated_at: product.updated_at,
      expiration_date: product.physical_product.expiration_date,
      perishable: product.physical_product.perishable,
      batch: new Set(batches),
      user: new User({
        created_at: product.user.created_at,
        external_id: product.user.external_id,
        updated_at: product.user.updated_at,
        user_type: UserType[product.user.user_type],
        id: product.user.id,
      }),
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
      ({ category }) => new Category(category),
    );

    const batches = product.product_batches.map(
      (batch) => new ProductBatch(batch),
    );

    const userType: string = Object.values($Enums.UserType).find(
      (userType) => userType === product.user.user_type,
    );

    if (!userType) {
      throw new Error('Invalid user type');
    }

    const digital_product = new DigitalProductDomain({
      id: product.id,
      name: product.name,
      description: product.description,
      categories: new Set(categories),
      inventory: null,
      reservation_type: product.reservation_type as ReservationType,
      created_at: product.created_at,
      updated_at: product.updated_at,
      url: product.digital_product.url,
      batch: new Set(batches),
      user: new User({
        created_at: product.user.created_at,
        external_id: product.user.external_id,
        updated_at: product.user.updated_at,
        user_type: UserType[product.user.user_type],
        id: product.user.id,
      }),
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
      ({ category }) => new Category(category),
    );

    const userType: string = Object.values($Enums.UserType).find(
      (userType) => userType === product.user.user_type,
    );

    const batches = product.product_batches.map(
      (batch) => new ProductBatch(batch),
    );

    if (!userType) {
      throw new Error('Invalid user type');
    }

    const product_domain = new ProductDomain({
      id: product.id,
      name: product.name,
      description: product.description,
      categories: new Set(categories),
      inventory: null,
      reservation_type: product.reservation_type as ReservationType,
      created_at: product.created_at,
      updated_at: product.updated_at,
      batch: new Set(batches),
      user: new User({
        created_at: product.user.created_at,
        external_id: product.user.external_id,
        updated_at: product.user.updated_at,
        user_type: UserType[product.user.user_type],
        id: product.user.id,
      }),
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
      user_id: product.getResponsibleId(),
      physical_product: {
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
      categories: Array.from(product.getCategories()).map((category) => ({
        id: category.getId(),
        created_at: category.getCreatedAt(),
        name: category.getName(),
        responsible_id: category.getResponsibleId(),
        updated_at: category.getUpdatedAt(),
      })),
      product_batches: Array.from(product.getBatches()).map((batch) => ({
        id: batch.getId(),
        quantity: batch.getQuantity(),
        created_at: batch.getCreatedAt(),
        updated_at: batch.getUpdatedAt(),
        expiration_date: batch.getExpirationDate(),
      })),
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
      user_id: product.getResponsibleId(),
      digital_product: {
        product_id: product.getId(),
        url: product.getUrl(),
      },
      categories: Array.from(product.getCategories()).map((category) => ({
        id: category.getId(),
        created_at: category.getCreatedAt(),
        name: category.getName(),
        responsible_id: category.getResponsibleId(),
        updated_at: category.getUpdatedAt(),
      })),
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
      physical_product: null,
      product_batches: null,
    };
  }

  private static toDatabaseProduct(
    product: ProductDomain,
  ): ToProductModelExtended {
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
      user_id: product.getResponsibleId(),
      categories: Array.from(product.getCategories()).map((category) => ({
        id: category.getId(),
        created_at: category.getCreatedAt(),
        name: category.getName(),
        responsible_id: category.getResponsibleId(),
        updated_at: category.getUpdatedAt(),
      })),
      digital_product: null,
      physical_product: null,
      inventory: product.getInventory()
        ? {
            alert_on_low_stock: product.getInventory().getAlertOnLowStock(),
            created_at: product.getInventory().getCreatedAt(),
            id: product.getInventory().getId(),
            minimum_stock: product.getInventory().getMinimumStock(),
            product_id: product.getInventory().getProduct().getId(),
            quantity: product.getInventory().getQuantity(),
            updated_at: product.getInventory().getUpdatedAt(),
          }
        : null,
      product_batches: null,
    };
  }
}

type ProductModelExtended = Prisma.ProductGetPayload<{
  include: {
    user: true;
    digital_product: {
      select: {
        url: true;
      };
    };
    physical_product: {
      select: {
        expiration_date: true;
        perishable: true;
      };
    };
    categories: {
      select: {
        category: true;
      };
    };
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
  physical_product: PhysicalProductModel | null;
  categories: {
    id: string;
    created_at: Date;
    updated_at: Date;
    name: string;
    responsible_id: string;
  }[];
  product_batches: {
    id: string;
    quantity: Decimal;
    created_at: Date;
    updated_at: Date;
    expiration_date: Date;
  }[];
  inventory: InventoryModel | null;
};
