import { Injectable } from '@nestjs/common';
import { ProductReservation } from 'src/@core/domain/product-reservation/product-reservation.domain';
import { DatabaseService } from 'src/config/database/database.service';

import { ProductReservationMapper } from 'src/@core/infra/mappers/product-reservation.mapper';
import { ProductBatch } from 'src/@core/domain/product-batch/product-batch.domain';

@Injectable()
export class ReserveProductRepository {
  constructor(private readonly database: DatabaseService) {}

  async saveReservation(
    productReservation: ProductReservation,
    productBatch: ProductBatch,
  ): Promise<void> {
    const productReservationDatabase =
      ProductReservationMapper.toDatabase(productReservation);

    await this.database.$transaction(async (db) => {
      await db.productReservation.create({
        data: productReservationDatabase,
      });

      await db.inventory.update({
        where: {
          product_id: productReservation.getProductId(),
        },
        data: {
          quantity: {
            decrement: productReservation.getQuantity(),
          },
        },
      });

      await db.productBatch.update({
        where: { id: productBatch.getId() },
        data: {
          quantity: {
            decrement: productReservation.getQuantity(),
          },
        },
      });
    });
  }

  async releaseReservation(productReservation: ProductReservation) {
    await this.database.$transaction(async (db) => {
      await db.productReservation.update({
        where: {
          id: productReservation.getId(),
        },
        data: {
          status: productReservation.getStatus(),
        },
      });
    });
  }

  async expireReservation(
    productReservation: ProductReservation,
    productBatch: ProductBatch,
  ) {
    await this.database.$transaction(async (db) => {
      await db.productReservation.update({
        where: {
          id: productReservation.getId(),
        },
        data: {
          status: productReservation.getStatus(),
        },
      });

      await db.inventory.update({
        where: {
          product_id: productReservation.getProductId(),
        },
        data: {
          quantity: {
            increment: productReservation.getQuantity(),
          },
        },
      });

      await db.productBatch.update({
        where: {
          id: productBatch.getId(),
        },
        data: {
          quantity: {
            increment: productReservation.getQuantity(),
          },
        },
      });
    });
  }

  async cancelReservation(
    productReservation: ProductReservation,
    productBatch: ProductBatch,
  ) {
    await this.database.$transaction(async (db) => {
      await db.productReservation.update({
        where: {
          id: productReservation.getId(),
        },
        data: {
          status: productReservation.getStatus(),
        },
      });

      await db.inventory.update({
        where: {
          product_id: productReservation.getProductId(),
        },
        data: {
          quantity: {
            increment: productReservation.getQuantity(),
          },
        },
      });

      await db.productBatch.update({
        where: {
          id: productBatch.getId(),
        },
        data: {
          quantity: {
            increment: productReservation.getQuantity(),
          },
        },
      });
    });
  }
}
