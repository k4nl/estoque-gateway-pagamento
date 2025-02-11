export type GetAllProductsFilter = {
  name?: string;
  description?: string;
  created_at?: Date;
  reservation_type?: string;
  user_id: string;
  offset: number;
  limit: number;
};
