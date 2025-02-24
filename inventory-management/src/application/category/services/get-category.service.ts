import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { User } from 'src/@core/domain/user/user.domain';
import { UserType } from '@prisma/client';

@Injectable()
export class GetCategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(category_id: string, user: User) {
    const is_admin = user.getUserType() === UserType.admin;

    const category = await this.categoryRepository.findById(category_id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (is_admin) {
      return {
        category,
      };
    }

    const category_responsible_id = category.getResponsibleId();

    if (category_responsible_id && category_responsible_id !== user.getId()) {
      throw new UnauthorizedException(
        'You do not have permission to view this category',
      );
    }

    return {
      category,
    };
  }
}
