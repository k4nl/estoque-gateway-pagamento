import { ReservationType } from 'src/@core/common/enum';
import { Inventory } from 'src/@core/domain/inventory/inventory.domain';

export type GetAllInventoryFilter = {
  from?: Date;
  to?: Date;
  user_id?: string;
  offset: number;
  limit: number;
  alert_on_low_stock?: boolean;
  reservation_type?: ReservationType;
  quantity?: number;
  products_name?: string[];
  minimum_stock?: number;
};

export type GetAllProductsFilterResponse = {
  total: number;
  inventories: Inventory[];
};
