import { Uuid } from 'src/@core/value-object';
import {
  CreateProductBatchCommand,
  ProductBatchProps,
} from './input/product-batch-props';
import { Decimal } from '@prisma/client/runtime/library';

export class ProductBatch {
  private id: Uuid;
  private quantity: Decimal;
  private expiration_date?: Date;
  private created_at: Date;
  private updated_at: Date;

  constructor(props: ProductBatchProps) {
    this.id = props.id instanceof Uuid ? props.id : new Uuid(props.id);
    this.quantity = props.quantity;
    this.expiration_date = props.expiration_date;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public static create(command: CreateProductBatchCommand): ProductBatch {
    return new ProductBatch({
      id: new Uuid(),
      quantity: command.quantity,
      expiration_date: command.expiration_date,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  // Getters

  public getId(): string {
    return this.id.value;
  }

  public getQuantity(): Decimal {
    return this.quantity;
  }

  public getExpirationDate(): Date | undefined {
    return this.expiration_date;
  }

  public getCreatedAt(): Date {
    return this.created_at;
  }

  public getUpdatedAt(): Date {
    return this.updated_at;
  }

  public decrementQuantity(quantity: Decimal) {
    const isNegative = this.quantity.minus(quantity).lessThan(0);

    if (isNegative) {
      throw new Error('Not enough quantity to reserve');
    }

    this.quantity = this.quantity.minus(quantity);
  }

  public incrementQuantity(quantity: Decimal) {
    this.quantity = this.quantity.plus(quantity);
  }

  public isExpired(): boolean {
    if (!this.expiration_date) {
      return false;
    }

    const now = new Date();

    return now > this.expiration_date;
  }
}
