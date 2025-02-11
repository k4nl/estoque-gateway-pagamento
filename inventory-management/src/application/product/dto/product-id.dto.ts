import { IsUuid } from 'src/application/common/decorators/validate-user-id.decorator';

export class ProductIdDTO {
  @IsUuid()
  id: string;
}
