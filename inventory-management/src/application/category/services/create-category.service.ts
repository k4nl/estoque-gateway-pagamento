import { ConflictException, Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDTO } from '../dto/create-category.dto';
import { ResponseDTO } from 'src/application/common/dto/response.dto';
import { Category } from 'src/@core/domain/category/category.domain';
import { User } from 'src/@core/domain/user/user.domain';
import { UserType } from 'src/@core/common/user-type';

@Injectable()
export class CreateCategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(
    data: CreateCategoryDTO,
    user: User,
  ): Promise<ResponseDTO<null>> {
    const is_admin = user.getUserType() === UserType.ADMIN;
    const responsible_id = is_admin ? null : user.getId();

    const category = Category.create({
      name: data.name,
      responsible_id,
    });

    const categoryExists = await this.categoryRepository.findByName(
      category.getName(),
      responsible_id,
    );

    if (categoryExists) {
      throw new ConflictException(
        `Category ${category.getName()} already exists`,
      );
    }

    await this.categoryRepository.create(category);

    return {
      message: 'Category created successfully',
    };
  }
}
