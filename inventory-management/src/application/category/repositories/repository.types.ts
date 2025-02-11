export type GetAllCategoriesFilter = {
  name?: string | string[];
  responsible_id?: string;
  offset?: number;
  limit?: number;
  created_at?: Date;
};
