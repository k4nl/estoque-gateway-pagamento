import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';
import { ProductBatch } from 'src/@core/domain/product-batch/product-batch.domain';
import { Inventory } from 'src/@core/domain/inventory/inventory.domain';
import { ProductBatchMapper } from 'src/@core/infra/mappers/product-batch.mapper';
import { User } from 'src/@core/domain/user/user.domain';
import { UserType } from '@prisma/client';
import { ProductBatchManager } from 'src/@core/domain/product-batch-manager/product-batch-manager.domain';
import { GetAllProductBatch } from './repository.types';

@Injectable()
export class ProductBatchRepository {
  constructor(private readonly database: DatabaseService) {}

  async updateQuantity(productBatchManager: ProductBatchManager) {
    const { productBatch } = productBatchManager;

    await this.database.productBatch.update({
      where: {
        id: productBatch.getId(),
      },
      data: {
        quantity: productBatchManager.update,
        updated_at: productBatch.getUpdatedAt(),
      },
    });
  }

  async update(productBatch: ProductBatch): Promise<void> {
    await this.database.productBatch.update({
      where: {
        id: productBatch.getId(),
      },
      data: {
        expiration_date: productBatch.getExpirationDate(),
        updated_at: productBatch.getUpdatedAt(),
      },
    });
  }

  async create(
    productBatch: ProductBatch,
    inventory: Inventory,
  ): Promise<void> {
    await this.database.$transaction(async (db) => {
      await db.inventory.update({
        where: {
          id: inventory.getId(),
        },
        data: {
          quantity: {
            increment: productBatch.getQuantity(),
          },
        },
      });

      await db.productBatch.create({
        data: {
          id: productBatch.getId(),
          quantity: productBatch.getQuantity(),
          expiration_date: productBatch.getExpirationDate(),
          product_id: productBatch.getProductId(),
          created_at: productBatch.getCreatedAt(),
          updated_at: productBatch.getUpdatedAt(),
        },
      });
    });
  }

  async findById(id: string, user: User): Promise<ProductBatch | null> {
    const where = {
      id,
    };

    if (user.getUserType() === UserType.client) {
      where['product'] = {
        user_id: user.getId(),
      };
    }

    const productBatch = await this.database.productBatch.findUnique({
      where,
    });

    if (!productBatch) {
      return null;
    }

    return ProductBatchMapper.toDomain({
      created_at: productBatch.created_at,
      expiration_date: productBatch.expiration_date,
      id: productBatch.id,
      product_id: productBatch.product_id,
      quantity: productBatch.quantity,
      updated_at: productBatch.updated_at,
    });
  }

  async getAll(data: GetAllProductBatch): Promise<{
    total: number;
    productBatches: ProductBatch[];
  }> {
    const where = {
      expiration_date:
        data.to_expiration_date || data.from_expiration_date
          ? {
              lte: data.to_expiration_date || undefined,
              gte: data.from_expiration_date || undefined,
            }
          : undefined,
      created_at:
        data.to_date || data.from_date
          ? {
              lte: data.to_date || undefined,
              gte: data.from_date || undefined,
            }
          : undefined,
      product_id: data.product_id || undefined,
    };

    const [productBatches, total] = await Promise.all([
      this.database.productBatch.findMany({
        where,
        skip: data.offset,
        take: data.limit,
      }),

      this.database.productBatch.count({
        where,
      }),
    ]);

    return {
      total,
      productBatches: productBatches.map(ProductBatchMapper.toDomain),
    };
  }
}
