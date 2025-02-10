import { IsOptional, IsString, Length } from 'class-validator';
import { IsUuid } from 'src/application/common/decorators/validate-user-id.decorator';

export class CreateCategoryDTO {
  @IsString({
    message: 'invalid category name',
  })
  @Length(3, 100, {
    message: 'category name must be between 3 and 100 characters',
  })
  name: string;

  @IsOptional()
  @IsUuid()
  responsible_id?: string;
}
