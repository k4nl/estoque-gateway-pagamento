import { Transform } from 'class-transformer';
import { IsDate, Validate } from 'class-validator';

export class UpdateProductBatchDTO {
  @Transform(({ value }) => new Date(value))
  @IsDate({
    message: 'expiration_date must be a valid date',
  })
  @Validate(
    ({ value }) => {
      const today = new Date();
      const date = new Date(value);

      if (date.getTime() < today.getTime()) {
        return false;
      }

      return true;
    },
    {
      message: 'expiration_date must be a future date',
    },
  )
  expiration_date: Date;
}
