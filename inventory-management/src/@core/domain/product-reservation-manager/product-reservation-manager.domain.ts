import { ProductReservation } from '../product-reservation/product-reservation.domain';
import {
  ReservationStatus,
  UpdateQuantityBatchEnum,
} from 'src/@core/common/enum';
import {
  CancelReservationProductManagerCommand,
  ExpireReservationProductManagerCommand,
  ReleaseProductReservationManagerCommand,
  ReserveProductReservationManagerCommand,
} from './input/product-reservation-manager.props';
import { Product } from '../product/product.domain';
import { ProductBatch } from '../product-batch/product-batch.domain';

export class ProductReservationManager {
  public static reserve(
    command: ReserveProductReservationManagerCommand,
  ): ProductReservation {
    const { product, batch, reservation_id, quantity } = command;
    if (!command.product) {
      throw new Error('No product to reserve');
    }

    const batch_to_reserve = product.getBatches().has(batch);

    if (!batch_to_reserve) {
      throw new Error('Batch not found');
    }

    if (batch.getQuantity().lessThan(quantity)) {
      throw new Error('Not enough quantity to reserve');
    }

    if (batch.isExpired()) {
      throw new Error('Batch expired');
    }

    const reservation = ProductReservation.create({
      reservation_id,
      product_id: product.getId(),
      quantity,
      status: ReservationStatus.RESERVED,
      batch,
      expires_at: command.minutes_to_expire,
    });

    batch.updateQuantity({
      type: UpdateQuantityBatchEnum.DECREMENT,
      quantity: quantity.toNumber(),
    });

    return reservation;
  }

  private static validateProductReservation(
    product_reservation: ProductReservation,
  ) {
    if (!product_reservation) {
      throw new Error('Product reservation not found');
    }

    if (product_reservation.getStatus() === ReservationStatus.CANCELED) {
      throw new Error('Product reservation already canceled');
    }

    if (product_reservation.getStatus() === ReservationStatus.RELEASED) {
      throw new Error('Product reservation already released');
    }
  }

  private static validateProductAndBatch(
    product: Product,
    batch: ProductBatch,
  ) {
    if (!product) {
      throw new Error('Product not found');
    }

    const has_batch = product.getBatches().has(batch);

    if (!has_batch) {
      throw new Error('Batch not found');
    }
  }

  public static cancel(
    command: CancelReservationProductManagerCommand,
  ): ProductReservation {
    const { product, product_reservation, batch } = command;

    this.validateProductReservation(product_reservation);

    this.validateProductAndBatch(product, batch);

    batch.incrementQuantity(product_reservation.getQuantity());

    return new ProductReservation({
      batch,
      created_at: product_reservation.getCreatedAt(),
      id: product_reservation.getId(),
      product_id: product_reservation.getProductId(),
      quantity: product_reservation.getQuantity(),
      reservation_id: product_reservation.getReservationId(),
      status: ReservationStatus.CANCELED,
      updated_at: new Date(),
      expires_at: product_reservation.getExpiresAt(),
    });
  }

  public static expire(
    command: ExpireReservationProductManagerCommand,
  ): ProductReservation {
    const { product, product_reservation, batch } = command;

    this.validateProductReservation(product_reservation);

    this.validateProductAndBatch(product, batch);

    batch.incrementQuantity(product_reservation.getQuantity());

    return new ProductReservation({
      batch,
      created_at: product_reservation.getCreatedAt(),
      id: product_reservation.getId(),
      product_id: product_reservation.getProductId(),
      quantity: product_reservation.getQuantity(),
      reservation_id: product_reservation.getReservationId(),
      status: ReservationStatus.EXPIRED,
      updated_at: new Date(),
      expires_at: product_reservation.getExpiresAt(),
    });
  }

  public static release(
    command: ReleaseProductReservationManagerCommand,
  ): ProductReservation {
    const { product, product_reservation, batch } = command;

    this.validateProductReservation(product_reservation);

    if (product_reservation.isExpired()) {
      throw new Error('Product reservation expired');
    }

    this.validateProductAndBatch(product, batch);

    return new ProductReservation({
      batch,
      created_at: product_reservation.getCreatedAt(),
      id: product_reservation.getId(),
      product_id: product_reservation.getProductId(),
      quantity: product_reservation.getQuantity(),
      reservation_id: product_reservation.getReservationId(),
      status: ReservationStatus.RELEASED,
      updated_at: new Date(),
      expires_at: product_reservation.getExpiresAt(),
    });
  }
}
