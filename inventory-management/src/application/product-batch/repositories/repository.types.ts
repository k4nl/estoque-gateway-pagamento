export type GetAllProductBatch = {
  from_date: Date;
  to_date: Date;
  from_expiration_date: Date;
  to_expiration_date: Date;
  product_id: string;
  user_id: string;
  offset: number;
  limit: number;
};
