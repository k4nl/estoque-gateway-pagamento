import { BadRequestException, Injectable } from '@nestjs/common';
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

    if (productCategoryDTO.category_ids.length !== categories.size) {
      throw new BadRequestException('Some categories do not exist');
    }

    const manager = product.removeCategories(categories);

    await this.productRepository.updateCategories(product, manager);

    return {
      message: `Categories ${Array.from(categories)
        .map((category) => category.getName())
        .join(', ')} removed to product ${product.getName()}`,
    };
  }
}
