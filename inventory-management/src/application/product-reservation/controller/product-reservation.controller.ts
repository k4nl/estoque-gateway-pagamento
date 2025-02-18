import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductReservationDTO } from '../dto/product-reservation.dto';
import { Roles } from 'src/application/common/decorators/roles.decorator';
import { UserType } from 'src/@core/common/user-type';
import { GetUser } from 'src/application/common/decorators/get-user.decorator';
import { User } from 'src/@core/domain/user/user.domain';
import { ReserveProductService } from '../services/reserve-product.service';
import { GetAllReservationsService } from '../services/get-all-reservations.service';
import { ReservationFilterDTO } from '../dto/reservation-filter.dto';
import { ExternalIdDTO } from '../dto/external-id.dto';
import { FindReservationByExternalIdService } from '../services/find-reservation.service';

@Controller('reserve')
export class ProductRepository {
  constructor(
    private readonly reserveProductService: ReserveProductService,
    private readonly getAllReservationsService: GetAllReservationsService,
    private readonly findReservationByExternalIdService: FindReservationByExternalIdService,
  ) {}

  @Roles(UserType.CLIENT)
  @Post('')
  async reserveProduct(
    @Body() productReservationDTO: ProductReservationDTO,
    @GetUser() user: User,
  ) {
    return this.reserveProductService.execute(productReservationDTO, user);
  }

  @Roles(UserType.CLIENT, UserType.ADMIN)
  @Get('')
  async getReservedProducts(
    @Query() reservationFilterDTO: ReservationFilterDTO,
    @GetUser() user: User,
  ) {
    return this.getAllReservationsService.execute(reservationFilterDTO, user);
  }

  @Roles(UserType.ADMIN, UserType.CLIENT)
  @Get(':external_id')
  async getReservedProduct(
    @Param() externalIdDTO: ExternalIdDTO,
    @GetUser() user: User,
  ) {
    return this.findReservationByExternalIdService.execute(
      externalIdDTO.external_id,
      user,
    );
  }
}
