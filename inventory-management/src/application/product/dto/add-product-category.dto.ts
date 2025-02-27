import { ValidateArray } from 'src/application/common/decorators/validate-array.decorator';

export class ProductCategoryDTO {
  @ValidateArray(String)
  category_ids: string[];
}
