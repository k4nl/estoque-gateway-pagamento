import { UserType } from 'src/@core/common/user-type';
import { IsUuid } from '../../decorators/validate-user-id.decorator';

export class JwtTokenDTO {
  id: string;
  user_type: UserType;
}

export class CreateTokenDTO {
  @IsUuid()
  id: string;
}
