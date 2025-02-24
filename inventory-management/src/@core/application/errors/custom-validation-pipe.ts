import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

const CustomValidationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  exceptionFactory: (errors: ValidationError[]) => {
    const formattedErrors = errors.map((error) => {
      if (error.children && error.children.length > 0) {
        return {
          property: error.property,
          children: error.children.map((child) => ({
            property: child.property,
            constraints: Object.values(child.constraints || {}).join(', '),
          })),
        };
      }

      return {
        property: error.property,
        constraints: Object.values(error.constraints || {}).join(', '),
      };
    });

    return new BadRequestException({
      message: 'Validation failed',
      errors: formattedErrors,
    });
  },
});

export default CustomValidationPipe;
