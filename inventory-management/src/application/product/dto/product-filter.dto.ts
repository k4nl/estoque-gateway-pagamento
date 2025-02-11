import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { EnumErrors } from 'src/@core/application/errors/enum.errors';
import { ReservationType } from 'src/@core/common/enum';
import { PaginationDTO } from 'src/application/common/pagination/pagination.dto';

export class ProductFilterDTO extends PaginationDTO {
  @IsOptional()
  @IsString({
    message: 'Product name must be a string',
  })
  name: string;

  @IsOptional()
  @IsString({
    message: 'Product description must be a string',
  })
  description: string;

  @IsOptional()
  @IsDate({
    message: 'Created at must be a date',
  })
  created_at: Date;

  @IsOptional()
  @IsEnum(ReservationType, {
    message: (args) =>
      EnumErrors.handleNotFound<ReservationType>(ReservationType, args.value),
  })
  reservation_type: ReservationType;
}
