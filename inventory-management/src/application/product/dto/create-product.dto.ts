import { Transform } from 'class-transformer';
import { IsEnum, IsString, Validate } from 'class-validator';
import { EnumErrors } from 'src/@core/application/errors/enum.errors';
import { ReservationType } from 'src/@core/common/enum';

export class CreateProductDTO {
  @IsString({
    message: 'Name must be a string',
  })
  name: string;

  @IsString({
    message: 'Description must be a string',
  })
  description: string;

  @Validate(
    (categories: string[]) => {
      const set_categories = new Set(categories);

      if (set_categories.size !== categories.length) {
        return false;
      }
    },
    {
      message: 'Categories must be unique',
    },
  )
  @Transform(({ value }) => new Set(value))
  categories: Set<string>;

  @IsEnum(ReservationType, {
    message: (args) =>
      EnumErrors.handleNotFound<ReservationType>(ReservationType, args.value),
  })
  reservation_type: ReservationType;
}
