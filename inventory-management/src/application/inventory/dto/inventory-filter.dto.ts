import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  Validate,
  ValidationArguments,
} from 'class-validator';
import { EnumErrors } from 'src/@core/application/errors/enum.errors';
import { ReservationType } from 'src/@core/common/enum';
import { IsUuid } from 'src/application/common/decorators/validate-user-id.decorator';
import { PaginationDTO } from 'src/application/common/pagination/pagination.dto';

export class InventoryFilterDTO extends PaginationDTO {
  @IsOptional()
  @Validate((value: string[]) => value.every((v) => typeof v === 'string'))
  products_name: string[];

  @IsOptional()
  @IsEnum(ReservationType, {
    message: (args: ValidationArguments) =>
      EnumErrors.handleNotFound<ReservationType>(ReservationType, args.value),
  })
  reservation_type: ReservationType;

  @IsUuid({ optional: true })
  user_id: string;

  @IsOptional()
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'Inventory quantity must be a valid number',
    },
  )
  quantity: number;

  @IsOptional()
  @IsBoolean({
    message: 'Alert on low stock must be a boolean',
  })
  has_alert_on_low_stock: boolean;

  @IsOptional()
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'Minimum stock must be a valid number',
    },
  )
  minimum_stock: number;

  @IsOptional()
  @IsDate({
    message: 'From date must be a valid date',
  })
  from_date: Date;

  @IsOptional()
  @IsDate({
    message: 'To date must be a valid date',
  })
  to_date: Date;
}
