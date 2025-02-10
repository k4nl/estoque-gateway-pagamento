import { Injectable } from '@nestjs/common';
import { Category as CategoryDomain } from 'src/@core/domain/category/category.domain';
import { CategoryMapper } from 'src/@core/infra/mappers/category.mapper';
import { DatabaseService } from 'src/config/database/database.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(category: CategoryDomain) {
    const mappedCategory = CategoryMapper.toDatabase(category);

    await this.database.category.create({
      data: mappedCategory,
    });
  }
}
