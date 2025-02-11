import { Injectable } from '@nestjs/common';
import { Category as CategoryDomain } from 'src/@core/domain/category/category.domain';
import { CategoryMapper } from 'src/@core/infra/mappers/category.mapper';
import { DatabaseService } from 'src/config/database/database.service';
import { GetAllCategoriesFilter } from './repository.types';

@Injectable()
export class CategoryRepository {
  constructor(private readonly database: DatabaseService) {}

  async create(category: CategoryDomain) {
    const mappedCategory = CategoryMapper.toDatabase(category);

    await this.database.category.create({
      data: mappedCategory,
    });
  }

  async getAll(filter: GetAllCategoriesFilter) {
    const [categories, total] = await Promise.all([
      this.database.category.findMany({
        where: {
          name: filter.name,
          created_at: filter.created_at,
          responsible_id: filter.responsible_id,
        },
        skip: filter.offset,
        take: filter.limit,
      }),
      this.database.category.count({
        where: {
          name: filter.name,
          created_at: filter.created_at,
          responsible_id: filter.responsible_id,
        },
      }),
    ]);

    return {
      categories: categories.map(CategoryMapper.toDomain),
      total,
    };
  }

  async findById(category_id: string): Promise<CategoryDomain | null> {
    const category = await this.database.category.findUnique({
      where: {
        id: category_id,
      },
    });

    if (!category) {
      return null;
    }

    return CategoryMapper.toDomain(category);
  }

  async findByName(
    name: string,
    responsible_id: string,
  ): Promise<CategoryDomain | null> {
    const category = await this.database.category.findUnique({
      where: {
        name_responsible_id: {
          name: name.toLowerCase(),
          responsible_id,
        },
      },
    });

    if (!category) {
      return null;
    }

    return CategoryMapper.toDomain(category);
  }

  async delete(category_id: string) {
    await this.database.category.delete({
      where: {
        id: category_id,
      },
    });
  }
}
