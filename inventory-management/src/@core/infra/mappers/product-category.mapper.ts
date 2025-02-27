import { Category } from 'src/@core/domain/category/category.domain';
import { ProductCategoryManager } from 'src/@core/domain/category/product-category-manager.domain';
import { Uuid } from 'src/@core/value-object';

export class ProductCategoryMapper {
  static toDatabase(
    productCategoryManager: ProductCategoryManager,
    product_id: string,
  ) {
    const categories_to_remove = Array.from(
      productCategoryManager.getCategoriesToRemove(),
    ).map((category: Category) => category.getId());

    const categories_to_add = Array.from(
      productCategoryManager.getCategoriesToAdd(),
    ).map((category: Category) => ({
      id: new Uuid().value,
      category_id: category.getId(),
    }));

    return {
      deleteMany:
        categories_to_remove.length > 0
          ? {
              product_id: product_id,
              category_id: {
                in: categories_to_remove,
              },
            }
          : undefined,
      createMany:
        categories_to_add.length > 0
          ? {
              data: categories_to_add,
            }
          : undefined,
    };
  }
}
