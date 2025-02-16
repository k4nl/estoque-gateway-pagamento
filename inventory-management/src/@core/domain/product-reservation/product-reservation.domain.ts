import { Decimal } from '@prisma/client/runtime/library';
import { ReservationStatus } from 'src/@core/common/enum';
import { Uuid } from 'src/@core/value-object';
import {
  CreateProductReservationCommand,
  ProductReservationProps,
} from './input/product-reservation.props';
import { ProductBatch } from '../product-batch/product-batch.domain';
import { ExpirationHandler } from 'src/@core/utils/expiration-handler';

export class ProductReservation {
  private id: Uuid;
  private reservation_id: Uuid;
  private product_id: Uuid;
  private batch: ProductBatch;
  private quantity: Decimal;
  private status: ReservationStatus;
  private expires_at: Date;
  private created_at: Date;
  private updated_at: Date;

  constructor(props: ProductReservationProps) {
    this.id = props.id instanceof Uuid ? props.id : new Uuid(props.id);
    this.reservation_id =
      props.reservation_id instanceof Uuid
        ? props.reservation_id
        : new Uuid(props.reservation_id);
    this.product_id =
      props.product_id instanceof Uuid
        ? props.product_id
        : new Uuid(props.product_id);
    this.quantity = props.quantity;
    this.status = props.status;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.batch = props.batch;
    this.expires_at = props.expires_at;
  }

  public static create(command: CreateProductReservationCommand) {
    return new ProductReservation({
      id: new Uuid(),
      reservation_id: command.reservation_id,
      product_id: command.product_id,
      quantity: command.quantity,
      status: command.status,
      created_at: new Date(),
      updated_at: new Date(),
      batch: command.batch,
      expires_at: ExpirationHandler.calculateExpirationDate(
        command.expires_at || 5,
      ),
    });
  }

  // Getters

  public getId(): string {
    return this.id.value;
  }

  public getReservationId(): string {
    return this.reservation_id.value;
  }

  public getProductId(): string {
    return this.product_id.value;
  }

  public getQuantity(): Decimal {
    return this.quantity;
  }

  public getStatus(): ReservationStatus {
    return this.status;
  }

  public getCreatedAt(): Date {
    return this.created_at;
  }

  public getUpdatedAt(): Date {
    return this.updated_at;
  }

  public getBatch(): ProductBatch {
    return this.batch;
  }

  public isExpired(): boolean {
    return ExpirationHandler.isExpired(this.expires_at);
  }

  public getExpiresAt(): Date {
    return this.expires_at;
  }

  // Setters

  public updateStatus(status: ReservationStatus) {
    this.status = status;
  }
}
