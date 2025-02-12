import { ProductReservation } from '../product-reservation/product-reservation.domain';
import { ReservationStatus } from 'src/@core/common/enum';
import { ReserveProductReservationManagerCommand } from './input/product-reservation-manager.props';

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

    const reservation = ProductReservation.create({
      reservation_id,
      product_id: product.getId(),
      quantity,
      status: ReservationStatus.RESERVED,
    });

    batch.decrementQuantity(quantity);

    return reservation;
  }
}
