import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryFilterDTO } from '../dto/category-filter.dto';
import { User } from 'src/@core/domain/user/user.domain';
import { UserType } from 'src/@core/common/user-type';
import { Pagination } from 'src/@core/application/pagination/pagination';

@Injectable()
export class GetAllCategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(params: CategoryFilterDTO, user: User) {
    const is_admin = user.getUserType() === UserType.ADMIN;

    const pagination = new Pagination({
      page: params.page,
      limit: params.limit,
    });

    const { categories, total } = await this.categoryRepository.getAll({
      name: params.name,
      created_at: params.created_at,
      responsible_id: is_admin ? null : user.getId(),
      offset: pagination.getOffset(),
      limit: pagination.getLimit(),
    });

    pagination.setMetadata(total);

    return {
      categories,
      ...pagination,
    };
  }
}
