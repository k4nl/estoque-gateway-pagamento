import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { User } from 'src/@core/domain/user/user.domain';
import { ProductCategoryDTO } from '../dto/add-product-category.dto';
import { GetProductService } from './get-product.service';
import { CategoryRepository } from 'src/application/category/repositories/category.repository';

@Injectable()
export class RemoveProductCategoryService {
  constructor(
    private readonly getProductService: GetProductService,
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    productCategoryDTO: ProductCategoryDTO,
    product_id: string,
    user: User,
  ) {
    const [product, categories] = await Promise.all([
      this.getProductService.execute(product_id, user),
      this.categoryRepository.getAllByIds(
        Array.from(productCategoryDTO.category_ids),
      ),
    ]);

    for (const category of categories) {
      const category_responsible = category.getResponsibleId();

      if (category_responsible && category_responsible !== user.getId()) {
        throw new Error(
          `You are not allowed to add category ${category.getName()}`,
        );
      }

      product.removeCategory(category);
    }

    await this.productRepository.update(product);

    return {
      message: `Categories ${productCategoryDTO.category_ids.join(
        ', ',
      )} removed from product ${product.getName()}`,
    };
  }
}
