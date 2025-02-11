import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { User } from 'src/@core/domain/user/user.domain';
import { UserType } from '@prisma/client';

@Injectable()
export class DeleteCategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(category_id: string, user: User) {
    const is_admin = user.getUserType() === UserType.admin;

    const category = await this.categoryRepository.findById(category_id);

    if (!category) {
      throw new Error('Category not found');
    }

    if (!is_admin && category.getResponsibleId() !== user.getId()) {
      throw new Error('You do not have permission to delete this category');
    }

    await this.categoryRepository.delete(category_id);

    return {
      message: 'Category deleted successfully',
    };
  }
}
