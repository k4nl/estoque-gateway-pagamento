import { Decimal } from '@prisma/client/runtime/library';
import { ReservationStatus } from 'src/@core/common/enum';
import { Uuid } from 'src/@core/value-object';

export type ProductReservationProps = {
  id: Uuid | string;
  reservation_id: Uuid | string;
  product_id: Uuid | string;
  quantity: Decimal;
  status: ReservationStatus;
  created_at: Date;
  updated_at: Date;
};

export type CreateProductReservationCommand = {
  reservation_id: Uuid | string;
  product_id: Uuid | string;
  quantity: Decimal;
  status: ReservationStatus;
};
