import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateInventoryDTO {
  @IsOptional()
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'The quantity must be a number',
    },
  )
  minimum_stock: number;

  @IsOptional()
  @IsBoolean({
    message: 'The alert_on_low_stock must be a boolean',
  })
  alert_on_low_stock: boolean;
}
