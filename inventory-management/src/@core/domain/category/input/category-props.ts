import { Name, Uuid } from 'src/@core/value-object';

export type CategoryProps = {
  id: string | Uuid;
  name: string | Name;
  responsible_id?: string | Uuid;
  created_at: Date;
  updated_at: Date;
};

export type CreateCategoryCommand = {
  name: string;
  responsible_id?: string;
};
