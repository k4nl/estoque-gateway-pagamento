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
  private created_at: Date;
  private updated_at: Date;

  constructor(props: UserConstructorProps) {
    this.id =
      typeof props.id === 'string'
        ? new Uuid(props.id)
        : props.id ?? new Uuid();
    this.external_id =
      typeof props.external_id === 'string'
        ? new Uuid(props.external_id)
        : props.external_id;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;
    this.user_type = props.user_type;
  }

  static create(command: UserCreateCommandProps): User {
    return new User({
      external_id: command.external_id,
      user_type: command.user_type,
      created_at: new Date(),
      updated_at: new Date(),
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

  public getCreatedAt(): Date {
    return this.created_at;
  }

  public getUpdatedAt(): Date {
    return this.updated_at;
  }
}
