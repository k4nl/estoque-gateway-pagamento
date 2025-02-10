import { UserType } from 'src/@core/common/user-type';
import { Uuid } from 'src/@core/value-object/uuid.vo';

export type UserConstructorProps = {
  id?: Uuid | string;
  external_id: Uuid | string;
  created_at: Date;
  updated_at: Date;
  user_type: UserType;
};

export type UserCreateCommandProps = {
  external_id: Uuid | string;
  user_type: UserType;
};
