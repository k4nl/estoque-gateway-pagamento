import { Description, Name, Uuid } from 'src/@core/value-object';
import {
  CreateDigitalProductCommand,
  DigitalProductProps,
} from './input/product-props';
import { Product } from './product.domain';

export class DigitalProduct extends Product {
  private unlimited_inventory: boolean;

  constructor(props: DigitalProductProps) {
    super(props);
    this.unlimited_inventory = props.unlimited_inventory;
  }

  public static override create(
    command: CreateDigitalProductCommand,
  ): DigitalProduct {
    return new DigitalProduct({
      id: new Uuid(),
      name: new Name(command.name),
      description: new Description(command.description),
      categories: command.categories,
      inventory: command.inventory,
      reservation_type: command.reservation_type,
      created_at: new Date(),
      updated_at: new Date(),
      unlimited_inventory: command.unlimited_inventory,
    });
  }

  // Getters
  public getUnlimitedInventory(): boolean {
    return this.unlimited_inventory;
  }
}
