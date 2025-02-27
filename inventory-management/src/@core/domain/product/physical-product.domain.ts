import { Product } from './product.domain';
import {
  CreatePhysicalProductCommand,
  PhysicalProductProps,
} from './input/product-props';
import { Description, Name, Uuid } from 'src/@core/value-object';
import { Inventory } from '../inventory/inventory.domain';
import { Decimal } from '@prisma/client/runtime/library';

export class PhysicalProduct extends Product {
  private expiration_date?: Date;
  private perishable: boolean;

  constructor(props: PhysicalProductProps) {
    super(props);
    this.expiration_date = props.expiration_date;
    this.perishable = props.perishable;
  }

  public static override create(
    command: CreatePhysicalProductCommand,
  ): PhysicalProduct {
    const physical_product = new PhysicalProduct({
      id: new Uuid(),
      name: new Name(command.name),
      description: new Description(command.description),
      categories: command.categories,
      inventory: command.inventory,
      reservation_type: command.reservation_type,
      created_at: new Date(),
      updated_at: new Date(),
      expiration_date: command.expiration_date,
      perishable: command.perishable,
      batch: command.batch,
      user: command.user,
    });

    if (!physical_product.inventory) {
      physical_product.inventory = Inventory.create({
        product: physical_product,
        quantity: new Decimal(0),
        alert_on_low_stock: false,
        minimum_stock: null,
      });
    }

    return physical_product;
  }

  // Getters

  public getExpirationDate(): Date {
    return this.expiration_date;
  }

  public getPerishable(): boolean {
    return this.perishable;
  }
}
