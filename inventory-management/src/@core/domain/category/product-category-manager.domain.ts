import { BadRequestException } from '@nestjs/common';
import { Product } from '../product/product.domain';
import { Category } from './category.domain';

export class ProductCategoryManager {
  private product: Product;
  private categories: Set<Category>;
  private categories_to_add: Set<Category>;
  private categories_to_remove: Set<Category>;

  constructor(props: ProductCategoryManagerProps) {
    this.product = props.product;
    this.categories = props.categories;
    this.categories_to_add = new Set();
    this.categories_to_remove = new Set();
  }

  private validateCategoryResponsible(category: Category): void {
    const category_responsible = category.getResponsibleId();

    if (
      category_responsible &&
      category_responsible !== this.product.getResponsibleId()
    ) {
      throw new BadRequestException(
        `You are not allowed to add category ${category.getName()}`,
      );
    }
  }

  public addCategories(categories: Set<Category>): void {
    for (const category of categories) {
      this.validateCategoryResponsible(category);

      if (!this.product.getCategories().has(category)) {
        this.categories_to_add.add(category);
      }
    }
  }

  public removeCategories(categories: Set<Category>): void {
    for (const category of categories) {
      if (!this.product.getCategories().has(category)) {
        this.categories_to_remove.add(category);
      }
    }
  }

  getCategoriesToAdd(): Set<Category> {
    return this.categories_to_add;
  }

  getCategoriesToRemove(): Set<Category> {
    return this.categories_to_remove;
  }
}

type ProductCategoryManagerProps = {
  product: Product;
  categories: Set<Category>;
};
