import { IsUuid } from 'src/application/common/decorators/validate-user-id.decorator';

export class UserIdDTO {
  @IsUuid()
  external_id: string;
}
