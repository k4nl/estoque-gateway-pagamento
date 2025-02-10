import { UserType } from 'src/@core/common/user-type';
import { Uuid } from 'src/@core/value-object/uuid.vo';
import {
  UserConstructorProps,
  UserCreateCommandProps,
} from './input/user-props';

export class User {
  private id: Uuid;
  private external_id: Uuid;
  private user_type: UserType;

  constructor(props: UserConstructorProps) {
    this.id =
      typeof props.id === 'string'
        ? new Uuid(props.id)
        : props.id ?? new Uuid();
  }

  static create(command: UserCreateCommandProps): User {
    return new User({
      external_id: command.external_id,
    });
  }

  public getId(): Uuid {
    return this.id;
  }

  public getExternalId(): Uuid {
    return this.external_id;
  }

  public getUserType(): UserType {
    return this.user_type;
  }
}
