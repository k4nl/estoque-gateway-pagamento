import {
  IsEnum,
  IsOptional,
  Validate,
  ValidationArguments,
} from 'class-validator';
import { EnumErrors } from 'src/@core/application/errors/enum.errors';
import { ReservationType } from 'src/@core/common/enum';

export class UpdateProductDTO {
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(ReservationType, {
    message: ({ value }) =>
      EnumErrors.handleNotFound<ReservationType>(ReservationType, value),
  })
  reservation_type?: ReservationType;

  @Validate(
    (obj: any) => {
      const { reservation_type, description } = obj;

      if (!reservation_type && !description) {
        return false;
      }
    },
    {
      message:
        'You must provide at least one field (reservation_type or description) to update',
    },
  )
  missing_fields: any;
}
