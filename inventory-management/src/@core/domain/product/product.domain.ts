import { Name, Description, Uuid } from 'src/@core/value-object';
import { Category } from '../category/category.domain';
import { Inventory } from '../inventory/inventory.domain';
import { ReservationType } from 'src/@core/common/enum';
import { CreateProductCommand, ProductProps } from './input/product-props';

export class Product {
  private id: Uuid;
  private name: Name;
  private description: Description;
  private categories: Set<Category>;
  private inventory: Inventory;
  private reservation_type: ReservationType;
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
  }

  public static create(command: CreateProductCommand): Product {
    return new Product({
      id: new Uuid(),
      name: new Name(command.name),
      description: new Description(command.description),
      categories: command.categories,
      inventory: new Inventory(),
      reservation_type: ReservationType.NON_RESERVABLE,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }

  // Getters
  public getId(): Uuid {
    return this.id;
  }

  public getName(): Name {
    return this.name;
  }

  public getDescription(): Description {
    return this.description;
  }

  public getCategories(): Set<Category> {
    return this.categories;
  }

  public getInventory(): Inventory {
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
}
