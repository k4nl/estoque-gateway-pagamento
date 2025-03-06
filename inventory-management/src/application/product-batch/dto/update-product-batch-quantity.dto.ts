import { IsEnum, IsNumber } from 'class-validator';
import { EnumErrors } from 'src/@core/application/errors/enum.errors';
import { UpdateQuantityBatchEnum } from 'src/@core/common/enum';

export class UpdateProductBatchQuantityDTO {
  @IsNumber(
    {
      allowInfinity: false,
      allowNaN: false,
    },
    {
      message: 'quantity must be a number',
    },
  )
  quantity: number;

  @IsEnum(UpdateQuantityBatchEnum, {
    message: (args) =>
      EnumErrors.handleNotFound<UpdateQuantityBatchEnum>(
        UpdateQuantityBatchEnum,
        args.value,
      ),
  })
  type: UpdateQuantityBatchEnum;
}
