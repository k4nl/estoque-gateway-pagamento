import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';
import {
  CreateInventoryLog,
  GetAllInventoryFilter,
  GetAllProductsFilterResponse,
} from './repository.types';
import { InventoryMapper } from 'src/@core/infra/mappers/inventory.mapper';
import { Inventory } from 'src/@core/domain/inventory/inventory.domain';

@Injectable()
export class InventoryRepository {
  constructor(private readonly database: DatabaseService) {}

  private handleUserFilter(filter: {
    user_id: string;
    products_name: string[];
  }) {
    const product = {};

    if (filter.products_name && filter.products_name.length > 0) {
      product['name'] = {
        in: filter.products_name,
      };
    }

    if (filter.user_id) {
      product['user_id'] = filter.user_id;
    }

    if (Object.keys(product).length > 0) {
      return product;
    }

    return undefined;
  }

  async getAll(
    props: GetAllInventoryFilter,
  ): Promise<GetAllProductsFilterResponse> {
    const { user_id, products_name } = props;

    const where = {
      product: this.handleUserFilter({
        user_id,
        products_name,
      }),
      alert_on_low_stock:
        props.alert_on_low_stock !== undefined
          ? props.alert_on_low_stock
          : undefined,
      quantity: props.quantity !== undefined ? props.quantity : undefined,
      minimum_stock:
        props.minimum_stock !== undefined ? props.minimum_stock : undefined,
      created_at:
        props.from || props.to
          ? {
              gte: props.from ? props.from : undefined,
              lte: props.to ? props.to : undefined,
            }
          : undefined,
    };

    const [inventories, total] = await Promise.all([
      this.database.inventory.findMany({
        where,
        skip: props.offset,
        take: props.limit,
        include: {
          product: {
            include: {
              digital_product: true,
              physical_product: true,
              categories: true,
              product_batches: true,
              user: true,
            },
          },
        },
      }),
      this.database.inventory.count({
        where,
      }),
    ]);

    return {
      inventories: inventories.map(InventoryMapper.toDomain),
      total,
    };
  }

  async getById(id: string) {
    const inventory = await this.database.inventory.findUnique({
      where: {
        id,
      },
      include: {
        product: {
          include: {
            digital_product: true,
            physical_product: true,
            categories: {
              include: {
                category: true,
              },
            },
            product_batches: true,
            user: true,
          },
        },
      },
    });

    return InventoryMapper.toDomain(inventory);
  }

  async update(inventory: Inventory) {
    await this.database.inventory.update({
      where: {
        id: inventory.getId(),
      },
      data: {
        minimum_stock: inventory.getMinimumStock().toNumber(),
        alert_on_low_stock: inventory.getAlertOnLowStock(),
        updated_at: inventory.getUpdatedAt(),
      },
    });
  }

  async createLog(createInventoryLog: CreateInventoryLog) {
    await this.database.inventoryLog.create({
      data: {
        inventory_id: createInventoryLog.inventory_id,
        quantity: createInventoryLog.quantity,
        reason: createInventoryLog.reason,
      },
    });
  }
}
