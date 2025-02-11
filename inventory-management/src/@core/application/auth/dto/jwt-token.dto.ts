import { UserType } from 'src/@core/common/user-type';

export class JwtTokenDTO {
  id: string;
  user_type: UserType;
}
