import { IsDate, IsOptional, IsString } from 'class-validator';
import { IsUuid } from 'src/application/common/decorators/validate-user-id.decorator';
import { PaginationDTO } from 'src/application/common/pagination/pagination.dto';

export class CategoryFilterDTO extends PaginationDTO {
  @IsOptional()
  @IsString({
    message: 'Field name must be a string',
  })
  name: string;

  @IsOptional()
  @IsDate({
    message: 'Field created_at must be a date',
  })
  created_at: Date;
}

export class CategoryIdDTO {
  @IsUuid()
  id: string;
}
