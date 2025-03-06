import { IsDate, IsOptional, Validate } from 'class-validator';
import { IsUuid } from 'src/application/common/decorators/validate-user-id.decorator';
import { PaginationDTO } from 'src/application/common/pagination/pagination.dto';

export class ProductBatchFilterDTO extends PaginationDTO {
  @IsOptional()
  @IsDate({ message: 'from date must be a valid date' })
  @Validate(
    ({ value }) => {
      const today = new Date();
      const date = new Date(value);

      if (date > today) {
        return false;
      }

      return true;
    },
    {
      message:
        'from date (invalid created at) must be less than or equal to today',
    },
  )
  from_date: Date;

  @IsOptional()
  @IsDate({ message: 'to date must be a valid date' })
  to_date: Date;

  @IsOptional()
  @IsDate({ message: 'from expiration date must be a valid date' })
  to_expiration_date: Date;

  @IsOptional()
  @IsDate({ message: 'from expiration date must be a valid date' })
  from_expiration_date: Date;

  @IsUuid({ optional: true })
  product_id: string;
}
