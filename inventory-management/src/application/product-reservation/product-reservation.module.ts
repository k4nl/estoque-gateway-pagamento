import { Module } from '@nestjs/common';
import {
  CancelReservationService,
  FindReservationByExternalIdService,
  GetAllReservationsService,
  ReleaseReservationService,
  ReserveProductService,
} from './services';
import { ProductReservationRepository } from './repositories/product-reservation.repository';
import { ReserveProductRepository } from './repositories/reserve-product.repository';
import { ProductModule } from '../product/product.module';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Module({
  imports: [ProductModule],
  controllers: [],
  providers: [
    CancelReservationService,
    FindReservationByExternalIdService,
    GetAllReservationsService,
    ReserveProductService,
    ReleaseReservationService,
    ProductReservationRepository,
    ReserveProductRepository,
    EventEmitter2,
  ],
  exports: [],
})
export class ProductReservationModule {}
