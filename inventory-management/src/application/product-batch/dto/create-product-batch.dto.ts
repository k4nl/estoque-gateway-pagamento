import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, Validate } from 'class-validator';
import { IsUuid } from 'src/application/common/decorators/validate-user-id.decorator';

export class CreateProductBatchDTO {
  @IsUuid()
  product_id: string;

  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'Quantity must be a number',
    },
  )
  quantity: number;

  @IsOptional()
  @Transform(({ value }) => (value ? new Date(value) : undefined))
  @IsDate({
    message: 'Expiration date must be a valid date',
  })
  @Validate(
    ({ value }) => {
      try {
        const date = new Date(value);
        const isValid = date instanceof Date && !isNaN(date.getTime());

        if (date < new Date()) {
          return false;
        }

        return isValid;
      } catch (error) {
        return false;
      }
    },
    {
      message: 'Expiration date must be a valid date and greater than today',
    },
  )
  expiration_date?: Date;
}
