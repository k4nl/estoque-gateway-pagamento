import { IsDate } from 'class-validator';
import { PaginationDTO } from 'src/application/common/pagination/pagination.dto';

export class GetAllUsersFilterDTO extends PaginationDTO {
  @IsDate({
    message: 'From date must be a valid date',
  })
  fromDate?: Date;

  @IsDate({
    message: 'To date must be a valid date',
  })
  toDate?: Date;
}
