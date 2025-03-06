import { Decimal } from '@prisma/client/runtime/library';
import { ProductBatch } from '../product-batch/product-batch.domain';
import {
  ProductBatchManagerProps,
  ProductBatchUpdateCommand,
} from './input/product-batch-manager.props';
import { UpdateQuantityBatchEnum } from 'src/@core/common/enum';

export class ProductBatchManager {
  public productBatch: ProductBatch;

  public update: ProductBatchManagerProps['update'];

  constructor(productBatch: ProductBatch) {
    this.productBatch = productBatch;
  }

  updateQuantity(command: ProductBatchUpdateCommand) {
    const quantity =
      typeof command.quantity === 'number'
        ? new Decimal(command.quantity)
        : command.quantity;

    if (command.type === UpdateQuantityBatchEnum.INCREMENT) {
      this.productBatch.incrementQuantity(quantity);
      this.update = { increment: this.productBatch.getQuantity() };
    }

    if (command.type === UpdateQuantityBatchEnum.DECREMENT) {
      this.validateDecrementQuantity(quantity);
      this.productBatch.decrementQuantity(quantity);
      this.update = { decrement: this.productBatch.getQuantity() };
    }

    return this;
  }

  private validateDecrementQuantity(quantity: Decimal) {
    const product_batch_quantity = this.productBatch.getQuantity();

    if (product_batch_quantity.minus(quantity).isNegative()) {
      throw new Error(
        `Product batch cannot be negative. Current quantity: ${product_batch_quantity.toString()}, decrement quantity: ${quantity.toString()}`,
      );
    }
  }
}
