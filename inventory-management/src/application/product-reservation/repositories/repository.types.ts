import { Decimal } from '@prisma/client/runtime/library';
import { ReservationStatus } from 'src/@core/common/enum';

export type ProductReservationMapperExtended = {
  id: string;
  reservation_id: string;
  bach: {
    id: string;
    quantity: Decimal;
    expiration_date: Date;
  };
  quantity: Decimal;
  status: ReservationStatus;
  created_at: Date;
  updated_at: Date;
  product: {
    id: string;
    name: string;
    user_id: string;
  };
};
