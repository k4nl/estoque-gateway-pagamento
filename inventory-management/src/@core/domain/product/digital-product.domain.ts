import { Description, Name, Uuid } from 'src/@core/value-object';
import {
  CreateDigitalProductCommand,
  DigitalProductProps,
  UpdateDigitalProductCommand,
} from './input/product-props';
import { Product } from './product.domain';
import { ProductBatch } from '../product-batch/product-batch.domain';
import { Inventory } from '../inventory/inventory.domain';
import { Decimal } from '@prisma/client/runtime/library';

export class DigitalProduct extends Product {
  private url: URL;

  constructor(props: DigitalProductProps) {
    super(props);
    this.setUrl(props.url);
  }

  public static override create(
    command: CreateDigitalProductCommand,
  ): DigitalProduct {
    const digital_product = new DigitalProduct({
      id: new Uuid(),
      name: new Name(command.name),
      description: new Description(command.description),
      categories: command.categories,
      inventory: command.inventory,
      reservation_type: command.reservation_type,
      created_at: new Date(),
      updated_at: new Date(),
      url: command.url,
      user: command.user,
      batch: new Set<ProductBatch>(),
    });

    if (!digital_product.inventory) {
      digital_product.inventory = Inventory.create({
        product: digital_product,
        quantity: new Decimal(0),
        alert_on_low_stock: false,
        minimum_stock: null,
      });
    }

    return digital_product;
  }

  // Getters
  public getUrl(): string {
    return this.url.toString();
  }

  private setUrl(url: string | URL): void {
    try {
      if (url instanceof URL) {
        this.url = url;
        return;
      }

      const newUrl = new URL(url);
      this.url = newUrl;
    } catch (error) {
      throw new Error('Invalid URL');
    }
  }

  public override update(command: UpdateDigitalProductCommand): void {
    if (command.url) {
      this.setUrl(command.url);
    }
    super.update(command);
  }
}
