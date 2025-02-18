import { User } from 'src/@core/domain/user/user.domain';

export type GetAllUsersFilter = {
  from: Date;
  to: Date;
  limit: number;
  offset: number;
};

export type GetAllUsersResponse = {
  users: User[];
  total: number;
};
