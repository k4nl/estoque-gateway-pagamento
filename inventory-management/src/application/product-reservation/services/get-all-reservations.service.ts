import { Injectable } from '@nestjs/common';
import { ProductReservationRepository } from '../repositories/product-reservation.repository';
import { ReservationFilterDTO } from '../dto/reservation-filter.dto';
import { User } from 'src/@core/domain/user/user.domain';
import { UserType } from 'src/@core/common/user-type';
import { Pagination } from 'src/@core/application/pagination/pagination';

@Injectable()
export class GetAllReservationsService {
  constructor(
    private readonly productReservationRepository: ProductReservationRepository,
  ) {}

  async execute(reservationFilterDTO: ReservationFilterDTO, user: User) {
    const is_admin = user.getUserType() === UserType.ADMIN;

    const pagination = new Pagination({
      limit: reservationFilterDTO.limit,
      page: reservationFilterDTO.page,
    });

    const { reservations, total } =
      await this.productReservationRepository.findAllReservations({
        from: reservationFilterDTO.fromDate,
        to: reservationFilterDTO.toDate,
        limit: pagination.getLimit(),
        offset: pagination.getOffset(),
        product_id: reservationFilterDTO.product_id,
        status: reservationFilterDTO.status,
      });

    if (!is_admin) {
      const user_id = user.getId();

      for (const reservation of reservations) {
        if (reservation.product.user_id !== user_id) {
          throw new Error('Unauthorized');
        }
      }
    }

    pagination.setMetadata(total);

    return {
      reservations,
      pagination,
    };
  }
}
