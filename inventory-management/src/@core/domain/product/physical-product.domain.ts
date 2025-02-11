import { Product } from './product.domain';
import {
  CreatePhysicalProductCommand,
  PhysicalProductProps,
} from './input/product-props';
import { Description, Name, Uuid } from 'src/@core/value-object';
import { ProductBatch } from '../product-batch/product-batch.domain';

export class PhysicalProduct extends Product {
  private expiration_date?: Date;
  private perishable: boolean;
  private batch: Set<ProductBatch>;

  constructor(props: PhysicalProductProps) {
    super(props);
    this.expiration_date = props.expiration_date;
    this.perishable = props.perishable;
    this.batch = props.batch;
  }

  public static override create(
    command: CreatePhysicalProductCommand,
  ): PhysicalProduct {
    return new PhysicalProduct({
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
  }

  // Getters

  public getExpirationDate(): Date {
    return this.expiration_date;
  }

  public getPerishable(): boolean {
    return this.perishable;
  }

  public getBatches(): Set<ProductBatch> {
    return this.batch;
  }
}
