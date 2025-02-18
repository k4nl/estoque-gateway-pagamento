import { DatabaseTrigger } from './trigger.enum';

export type TriggerType = {
  type: DatabaseTrigger;
};

export type LowStockTriggerPayload = TriggerType & {
  id: string;
  product_id: string;
  quantity: number;
  minimum_stock: number;
  alert_on_low_stock: boolean;
};
