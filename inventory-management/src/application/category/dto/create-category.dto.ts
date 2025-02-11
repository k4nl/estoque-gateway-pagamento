import { IsString, Length } from 'class-validator';

export class CreateCategoryDTO {
  @IsString({
    message: 'invalid category name',
  })
  @Length(3, 100, {
    message: 'category name must be between 3 and 100 characters',
  })
  name: string;
}
