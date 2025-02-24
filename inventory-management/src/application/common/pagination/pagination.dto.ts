import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDTO {
  @IsOptional()
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0,
    },
    {
      message: 'Field page must be a number',
    },
  )
  page: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
      maxDecimalPlaces: 0,
    },
    {
      message: 'Field limit must be a number',
    },
  )
  limit: number;
}
