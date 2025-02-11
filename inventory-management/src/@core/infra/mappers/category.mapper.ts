import { Category as CategoryDomain } from 'src/@core/domain/category/category.domain';
import { Category as CategoryModel } from '@prisma/client';

export class CategoryMapper {
  public static toDomain(category: CategoryModel): CategoryDomain {
    return new CategoryDomain({
      created_at: category.created_at,
      id: category.id,
      name: category.name,
      updated_at: category.updated_at,
    });
  }

  public static toDatabase(category: CategoryDomain): CategoryModel {
    return {
      created_at: category.getCreatedAt(),
      id: category.getId(),
      name: category.getName().toLowerCase(),
      updated_at: category.getUpdatedAt(),
      responsible_id: category.getResponsibleId(),
    };
  }
}
