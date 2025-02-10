import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';
import { CreateCategoryDTO } from '../dto/create-category.dto';
import { ResponseDTO } from 'src/application/common/dto/response.dto';
import { Category } from 'src/@core/domain/category/category.domain';

@Injectable()
export class CreateCategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(data: CreateCategoryDTO): Promise<ResponseDTO<null>> {
    const category = Category.create({
      name: data.name,
      responsible_id: data.responsible_id,
    });

    await this.categoryRepository.create(category);

    return {
      message: 'Category created successfully',
      data: null,
    };
  }
}
