import { IsNumber, IsOptional } from 'class-validator';

export class PaginationProps {
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
