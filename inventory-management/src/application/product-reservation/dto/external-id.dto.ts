import { IsUuid } from 'src/application/common/decorators/validate-user-id.decorator';

export class ExternalIdDTO {
  @IsUuid()
  external_id: string;
}
