import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Uuid } from 'src/@core/value-object/uuid.vo';

export interface IsUuidOptions extends ValidationOptions {
  optional?: boolean;
}

@ValidatorConstraint({ name: 'ValidateUserId', async: false })
class ValidateUserId implements ValidatorConstraintInterface {
  private optional: boolean;

  constructor(optional = false) {
    this.optional = optional;
  }

  validate(value: string): Promise<boolean> | boolean {
    if (this.optional) {
      return true;
    }

    try {
      new Uuid(value);
      return true;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(): string {
    return 'user_id must be a valid UUID';
  }
}

export function IsUuid(isUuidOptions?: IsUuidOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: isUuidOptions,
      constraints: [],
      validator: ValidateUserId,
    });
  };
}
