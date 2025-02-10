import { Uuid } from 'src/@core/value-object/uuid.vo';

export type UserConstructorProps = {
  id?: Uuid | string;
  external_id: Uuid | string;
};

export type UserCreateCommandProps = {
  external_id: Uuid | string;
};
