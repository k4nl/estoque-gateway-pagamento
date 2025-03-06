import { Uuid } from 'src/@core/value-object';
import {
  CreateProductBatchCommand,
  ProductBatchProps,
  UpdateProductBatchCommand,
} from './input/product-batch-props';
import { Decimal } from '@prisma/client/runtime/library';
import { ProductBatchUpdateCommand } from '../product-batch-manager/input/product-batch-manager.props';
import { ProductBatchManager } from '../product-batch-manager/product-batch-manager.domain';

export class ProductBatch {
  private id: Uuid;
  private quantity: Decimal;
  private expiration_date?: Date;
  private product_id: Uuid;
  private created_at: Date;
  private updated_at: Date;

  constructor(props: ProductBatchProps) {
    this.id = props.id instanceof Uuid ? props.id : new Uuid(props.id);
    this.quantity = props.quantity;
    this.expiration_date = props.expiration_date;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.product_id = props.product_id;
  }

  public static create(command: CreateProductBatchCommand): ProductBatch {
    return new ProductBatch({
      id: new Uuid(),
      quantity: command.quantity,
      expiration_date: command.expiration_date,
      product_id:
        typeof command.product_id === 'string'
          ? new Uuid(command.product_id)
          : command.product_id,
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

  public updateQuantity(
    command: ProductBatchUpdateCommand,
  ): ProductBatchManager {
    const productBatchManager = new ProductBatchManager(this);

    productBatchManager.updateQuantity(command);

    this.updated_at = new Date();

    return productBatchManager;
  }

  public decrementQuantity(quantity: Decimal) {
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

  public getProductId(): string {
    return this.product_id.toString();
  }

  public update(command: UpdateProductBatchCommand) {
    this.expiration_date = command.expiration_date;
    this.updated_at = new Date();
  }

  public toJSON() {
    return {
      id: this.id.value,
      quantity: this.quantity.toNumber(),
      expiration_date: this.expiration_date,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
