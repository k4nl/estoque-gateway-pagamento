import { Name, Description, Uuid } from 'src/@core/value-object';
import { Category } from '../category/category.domain';
import { Inventory } from '../inventory/inventory.domain';
import { ReservationType } from 'src/@core/common/enum';
import {
  CreateProductCommand,
  ProductProps,
  UpdateProductCommand,
} from './input/product-props';
import { Decimal } from '@prisma/client/runtime/library';
import { User } from '../user/user.domain';
import { ProductBatch } from '../product-batch/product-batch.domain';
import { ProductReservationManager } from '../product-reservation-manager/product-reservation-manager.domain';
import { ProductReservation } from '../product-reservation/product-reservation.domain';
import {
  CancelReservationProductManagerCommand,
  ExpireReservationProductManagerCommand,
  ReleaseProductReservationManagerCommand,
  ReserveProductReservationManagerCommand,
} from '../product-reservation-manager/input/product-reservation-manager.props';
import { ProductCategoryManager } from '../category/product-category-manager.domain';
import { BadRequestException } from '@nestjs/common';

export class Product {
  private id: Uuid;
  private name: Name;
  private description: Description;
  private categories: Set<Category>;
  private batches: Set<ProductBatch>;
  protected inventory: Inventory | null;
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
    this.batches = props.batch;
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
      batch: new Set<ProductBatch>(),
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

  public getBatches(): Set<ProductBatch> {
    return this.batches;
  }

  public addCategories(categories: Set<Category>): ProductCategoryManager {
    const product_category_manager = new ProductCategoryManager({
      product: this,
      categories: categories,
    });

    product_category_manager.addCategories(categories);

    this.categories = new Set([
      ...Array.from(this.categories),
      ...Array.from(product_category_manager.getCategoriesToAdd()),
    ]);

    this.updated_at = new Date();

    return product_category_manager;
  }

  public removeCategories(categories: Set<Category>): ProductCategoryManager {
    const product_category_manager = new ProductCategoryManager({
      product: this,
      categories: this.categories,
    });

    product_category_manager.removeCategories(categories);

    this.categories = new Set(
      Array.from(this.categories).filter(
        (category) =>
          !Array.from(
            product_category_manager.getCategoriesToRemove(),
          ).includes(category),
      ),
    );

    this.updated_at = new Date();

    return product_category_manager;
  }

  public addProductBatch(batch: ProductBatch): void {
    if (this.batches.has(batch)) {
      throw new BadRequestException('Batch already exists');
    }

    this.batches.add(batch);
  }

  private updateDescription(description?: string): void {
    if (!description) {
      return;
    }

    const newDescription = new Description(description);

    if (this.description.equals(newDescription)) {
      return;
    }

    this.description = newDescription;
  }

  private updateReservation(reservation?: ReservationType): void {
    if (!reservation) {
      return;
    }

    if (this.reservation_type === reservation) {
      return;
    }

    this.reservation_type = reservation;
  }

  public update(command: UpdateProductCommand): void {
    this.updateDescription(command.description);
    this.updateReservation(command.reservation_type);

    this.updated_at = new Date();
  }

  public getBatchById(batch_id: string): ProductBatch {
    const batch = Array.from(this.batches).find(
      (_batch) => _batch.getId() === batch_id,
    );

    if (!batch) {
      throw new Error('Batch not found');
    }

    return batch;
  }

  public reserve(
    command: Omit<ReserveProductReservationManagerCommand, 'product'>,
  ): ProductReservation {
    return ProductReservationManager.reserve({
      product: this,
      quantity: command.quantity,
      batch: command.batch,
      reservation_id: command.reservation_id,
      minutes_to_expire: command.minutes_to_expire,
    });
  }

  public cancelReservation(
    command: Omit<CancelReservationProductManagerCommand, 'product'>,
  ): ProductReservation {
    return ProductReservationManager.cancel({
      product: this,
      product_reservation: command.product_reservation,
      batch: command.batch,
    });
  }

  public releaseReservation(
    command: Omit<ReleaseProductReservationManagerCommand, 'product'>,
  ): ProductReservation {
    return ProductReservationManager.release({
      product: this,
      product_reservation: command.product_reservation,
      batch: command.batch,
    });
  }

  public expireReservation(
    command: Omit<ExpireReservationProductManagerCommand, 'product'>,
  ): ProductReservation {
    return ProductReservationManager.expire({
      product: this,
      product_reservation: command.product_reservation,
      batch: command.batch,
    });
  }

  public toJSON() {
    return {
      id: this.getId(),
      name: this.getName(),
      description: this.getDescription(),
      categories: Array.from(this.categories).map((c) => c.toJSON?.() ?? c), // Se Category tiver um método toJSON()
      reservation_type: this.getReservationType(),
      created_at: this.getCreatedAt(),
      updated_at: this.getUpdatedAt(),
      responsible_id: this.getResponsibleId(),
      batches: Array.from(this.batches).map((b) => b.toJSON?.() ?? b),
      inventory: this.inventory ? this.inventory.toJSON() : null, // Evita referência circular
    };
  }
}
