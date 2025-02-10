import { IsUuid } from 'src/application/common/decorators/validate-user-id.decorator';

export class CreateUserDto {
  @IsUuid()
  readonly user_id: string;
}
