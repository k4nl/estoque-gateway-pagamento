import { Uuid } from 'src/@core/value-object';
import { Product } from '../product/product.domain';
import { Decimal } from '@prisma/client/runtime/library';
import {
  CreateInventoryCommand,
  InventoryProps,
  UpdateInventoryCommand,
} from './input/inventory-props';

export class Inventory {
  private id: Uuid;
  private product: Product;
  private quantity: Decimal;
  private minimum_stock?: Decimal;
  private alert_on_low_stock: boolean;
  private created_at: Date;
  private updated_at: Date;

  constructor(props: InventoryProps) {
    this.id = props.id instanceof Uuid ? props.id : new Uuid(props.id);
    this.product = props.product;
    this.quantity = props.quantity;
    this.minimum_stock = props.minimum_stock;
    this.alert_on_low_stock = props.alert_on_low_stock;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
  }

  public static create(command: CreateInventoryCommand): Inventory {
    return new Inventory({
      id: new Uuid(),
      product: command.product,
      quantity: command.quantity,
      minimum_stock: command.minimum_stock,
      alert_on_low_stock: command.alert_on_low_stock,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  // Getters

  public getId(): string {
    return this.id.value;
  }

  public getProduct(): Product {
    return this.product;
  }

  public getQuantity(): Decimal {
    return this.quantity;
  }

  public getMinimumStock(): Decimal {
    return this.minimum_stock;
  }

  public getAlertOnLowStock(): boolean {
    return this.alert_on_low_stock;
  }

  public getCreatedAt(): Date {
    return this.created_at;
  }

  public getUpdatedAt(): Date {
    return this.updated_at;
  }

  public update(command: UpdateInventoryCommand): void {
    if (command.minimum_stock !== undefined) {
      this.minimum_stock = new Decimal(command.minimum_stock);
    }

    if (command.alert_on_low_stock !== undefined) {
      this.alert_on_low_stock = command.alert_on_low_stock;
    }

    this.updated_at = new Date();
  }
}
