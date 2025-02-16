import { IsDate, IsEnum } from 'class-validator';
import { EnumErrors } from 'src/@core/application/errors/enum.errors';
import { ReservationStatus } from 'src/@core/common/enum';
import { IsUuid } from 'src/application/common/decorators/validate-user-id.decorator';
import { PaginationDTO } from 'src/application/common/pagination/pagination.dto';

export class ReservationFilterDTO extends PaginationDTO {
  @IsDate({
    message: 'From date must be a valid date',
  })
  fromDate?: Date;

  @IsDate({
    message: 'To date must be a valid date',
  })
  toDate?: Date;

  @IsEnum(ReservationStatus, {
    message: (args) =>
      EnumErrors.handleNotFound<ReservationStatus>(
        ReservationStatus,
        args.value,
      ),
  })
  status?: ReservationStatus;

  @IsUuid()
  product_id?: string;
}
