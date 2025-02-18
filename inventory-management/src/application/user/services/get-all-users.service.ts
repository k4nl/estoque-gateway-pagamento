import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { Pagination } from 'src/@core/application/pagination/pagination';
import { GetAllUsersFilterDTO } from '../dto/get-all-filter.dto';

@Injectable()
export class GetAllUsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(filter: GetAllUsersFilterDTO) {
    const pagination = new Pagination({
      page: filter.page,
      limit: filter.limit,
    });

    const { users, total } = await this.userRepository.getAll({
      from: filter.fromDate,
      to: filter.toDate,
      limit: pagination.getLimit(),
      offset: pagination.getOffset(),
    });

    pagination.setMetadata(total);

    return {
      users,
      pagination,
    };
  }
}
