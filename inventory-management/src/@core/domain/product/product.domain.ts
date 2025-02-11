import { Name, Description, Uuid } from 'src/@core/value-object';
import { Category } from '../category/category.domain';
import { Inventory } from '../inventory/inventory.domain';
import { ReservationType } from 'src/@core/common/enum';
import { CreateProductCommand, ProductProps } from './input/product-props';
import { Decimal } from '@prisma/client/runtime/library';
import { User } from '../user/user.domain';

export class Product {
  private id: Uuid;
  private name: Name;
  private description: Description;
  private categories: Set<Category>;
  private inventory: Inventory | null;
  private reservation_type: ReservationType;
  private user: User;
  private created_at: Date;
  private updated_at: Date;

  constructor(props: ProductProps) {
    this.id = props.id instanceof Uuid ? props.id : new Uuid(props.id);
    this.name = props.name instanceof Name ? props.name : new Name(props.name);
    this.description =
      props.description instanceof Description
        ? props.description
        : new Description(props.description);
    this.categories = new Set(props.categories);
    this.inventory = props.inventory;
    this.reservation_type = props.reservation_type;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.user = props.user;
  }

  public static create(command: CreateProductCommand): Product {
    const product = new Product({
      id: new Uuid(),
      name: new Name(command.name),
      description: new Description(command.description),
      categories: command.categories,
      inventory: command.inventory,
      reservation_type: command.reservation_type,
      created_at: new Date(),
      updated_at: new Date(),
      user: command.user,
    });

    if (!product.inventory) {
      product.inventory = Inventory.create({
        product: product,
        alert_on_low_stock: false,
        minimum_stock: null,
        quantity: new Decimal(0),
      });
    }

    return product;
  }

  // setters

  public setInventory(inventory: Inventory): void {
    this.inventory = inventory;
  }

  // Getters
  public getId(): string {
    return this.id.value;
  }

  public getName(): string {
    return this.name.value;
  }

  public getDescription(): string {
    return this.description.value;
  }

  public getCategories(): Set<Category> {
    return this.categories;
  }

  public getInventory(): Inventory | null {
    return this.inventory;
  }

  public getReservationType(): ReservationType {
    return this.reservation_type;
  }

  public getCreatedAt(): Date {
    return this.created_at;
  }

  public getUpdatedAt(): Date {
    return this.updated_at;
  }

  public getResponsibleId(): string {
    return this.user.getId();
  }

  public addCategory(category: Category): void {
    if (this.categories.has(category)) {
      throw new Error('Category already added');
    }

    this.categories.add(category);
    this.updated_at = new Date();
  }
}
