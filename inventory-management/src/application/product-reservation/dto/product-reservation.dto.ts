import { IsNumber } from 'class-validator';
import { IsUuid } from 'src/application/common/decorators/validate-user-id.decorator';

export class ProductReservationDTO {
  @IsUuid()
  reservation_id: string;

  @IsUuid()
  batch_id: string;

  @IsNumber({
    allowInfinity: false,
    allowNaN: false,
  })
  quantity: number;
}
