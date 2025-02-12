import { Injectable } from '@nestjs/common';
import { User } from 'src/@core/domain/user/user.domain';
import { GetProductService } from './get-product.service';
import { ProductReservationDTO } from '../dto/product-reservation.dto';
import { Decimal } from '@prisma/client/runtime/library';
import { ProductReservationRepository } from 'src/application/product-reservation/repositories/product-reservation.repository';
import { ReserveProductRepository } from '../repositories/reserve-product.repository';

@Injectable()
export class ReserveProductService {
  constructor(
    private readonly getProductService: GetProductService,
    private readonly productReservationRepository: ProductReservationRepository,
    private readonly reserveProductRepository: ReserveProductRepository,
  ) {}

  async execute(
    reserveProductDTO: ProductReservationDTO,
    product_id: string,
    user: User,
  ) {
    const product = await this.getProductService.execute(product_id, user);

    const is_reserverd =
      await this.productReservationRepository.findReservationById(
        reserveProductDTO.reservation_id,
      );

    if (is_reserverd) {
      throw new Error(
        `Reservation id: ${reserveProductDTO.reservation_id} already exists`,
      );
    }

    const productBatch = product.getBatchById(reserveProductDTO.batch_id);

    const product_reservation = product.reserve({
      batch: productBatch,
      quantity: new Decimal(reserveProductDTO.quantity),
      reservation_id: reserveProductDTO.reservation_id,
    });

    await this.reserveProductRepository.saveReservation(
      product_reservation,
      productBatch,
    );

    return {
      message: `Product ${product.getName()} reserved successfully`,
    };
  }
}
