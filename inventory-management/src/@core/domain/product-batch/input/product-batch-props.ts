import { Decimal } from '@prisma/client/runtime/library';
import { Uuid } from 'src/@core/value-object';

export type ProductBatchProps = {
  id: string | Uuid;
  quantity: Decimal;
  expiration_date?: Date;
  created_at: Date;
  updated_at: Date;
};

export type CreateProductBatchCommand = {
  quantity: Decimal;
  expiration_date?: Date;
};
