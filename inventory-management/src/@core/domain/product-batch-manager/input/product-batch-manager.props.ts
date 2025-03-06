import { Decimal } from '@prisma/client/runtime/library';
import { UpdateQuantityBatchEnum } from 'src/@core/common/enum';

export type ProductBatchUpdateCommand = {
  type: UpdateQuantityBatchEnum;
  quantity: number | Decimal;
};

export interface ProductBatchManagerProps {
  update:
    | { increment: Decimal; decrement?: never }
    | { decrement: Decimal; increment?: never };
}
