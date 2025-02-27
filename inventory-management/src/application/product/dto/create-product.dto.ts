import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  IsUrl,
  Validate,
  ValidateNested,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EnumErrors } from 'src/@core/application/errors/enum.errors';
import { ReservationType } from 'src/@core/common/enum';

export class DigitalProductDTO {
  @IsUrl(
    {
      require_host: true,
      require_protocol: true,
    },
    {
      message: 'URL must be a valid URL',
    },
  )
  url: string;
}

export class PhysicalProductDTO {
  @Transform(({ value }) => new Date(value))
  @IsDate({
    message: 'Expiration date must be a date',
  })
  @Validate(
    ({ value }) => {
      const date = new Date(value);

      if (date < new Date()) {
        return false;
      }

      return true;
    },
    {
      message: 'Expiration date must be greater than current date',
    },
  )
  expiration_date: Date;

  @IsString({
    message: 'Perishable must be a string',
  })
  perishable: string;
}

@ValidatorConstraint({ name: 'exclusiveFields', async: false })
class ExclusiveFieldsValidator implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const object = args.object as CreateProductDTO;
    const hasDigital = !!object.digital;
    const hasPhysical = !!object.physical;

    // Deve ter exatamente uma das duas propriedades
    return (hasDigital && !hasPhysical) || (!hasDigital && hasPhysical);
  }
}

export class CreateProductDTO {
  @IsString({
    message: 'Name must be a string',
  })
  name: string;

  @IsString({
    message: 'Description must be a string',
  })
  description: string;

  @Validate(
    (categories: string[]) => {
      const set_categories = new Set(categories);

      if (set_categories.size !== categories.length) {
        return false;
      }
    },
    {
      message: 'Categories must be unique',
    },
  )
  @Transform(({ value }) => new Set(value))
  categories: Set<string>;

  @IsEnum(ReservationType, {
    message: (args) =>
      EnumErrors.handleNotFound<ReservationType>(ReservationType, args.value),
  })
  reservation_type: ReservationType;

  @IsOptional()
  @ValidateNested()
  @Type(() => DigitalProductDTO)
  digital?: DigitalProductDTO;

  @IsOptional()
  @ValidateNested()
  @Type(() => PhysicalProductDTO)
  physical?: PhysicalProductDTO;

  @Validate(ExclusiveFieldsValidator, ['digital', 'physical'], {
    message:
      'Exactly one of digital or physical must be provided, but not both or neither. You must provide object with key digital or physical',
  })
  product_type: any;
}
