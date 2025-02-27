import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export interface ValidateArrayOptions extends ValidationOptions {
  arrayContent?: any;
}

@ValidatorConstraint({ name: 'ValidateArray', async: false })
export class ValidateArrayConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    if (!Array.isArray(value)) {
      this.defaultMessage(args);
      return false;
    }

    if (value.length === 0) {
      this.defaultMessage(args);
      return false;
    }

    const expectedType = args.constraints[0];

    if (typeof expectedType === 'function' && expectedType.prototype) {
      return value.every((item) => {
        try {
          const instance = new expectedType(item);

          if (instance instanceof expectedType) {
            return true;
          }

          return false;
        } catch (error) {
          return false;
        }
      });
    } else {
      return value.every((item) => typeof item === expectedType);
    }
  }

  defaultMessage(args: ValidationArguments): string {
    const property = args.property;
    const expectedType = args.constraints[0];

    if (!Array.isArray(args.value)) {
      return `${property} must be an array`;
    }

    if (args.value.length === 0) {
      return `${property} must be a non-empty array`;
    }

    const typeName =
      typeof expectedType === 'function' && expectedType.prototype
        ? expectedType.name
        : expectedType;

    return `${property} must be an array of ${typeName}`;
  }
}

// Função decorator
export function ValidateArray(
  arrayContent: any,
  validationOptions?: ValidationOptions,
) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [arrayContent],
      validator: ValidateArrayConstraint,
    });
  };
}
