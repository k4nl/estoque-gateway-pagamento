import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Uuid } from 'src/@core/value-object/uuid.vo';

@ValidatorConstraint({ name: 'ValidateUserId', async: false })
class ValidateUserId implements ValidatorConstraintInterface {
  validate(value: string): Promise<boolean> | boolean {
    try {
      new Uuid(value);
    } catch (error) {
      return false;
    }
  }

  defaultMessage(): string {
    return 'user_id must be a valid UUID';
  }
}

export function IsUuid(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ValidateUserId,
    });
  };
}
