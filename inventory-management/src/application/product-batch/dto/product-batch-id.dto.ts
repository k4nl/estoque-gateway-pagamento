import { IsUuid } from 'src/application/common/decorators/validate-user-id.decorator';

export class ProductBatchIdDTO {
  @IsUuid()
  id: string;
}
