import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { GetProductService } from './get-product.service';
import { ProductCategoryDTO } from '../dto/add-product-category.dto';
import { User } from 'src/@core/domain/user/user.domain';
import { CategoryRepository } from 'src/application/category/repositories/category.repository';
import { ResponseDTO } from 'src/application/common/dto/response.dto';

@Injectable()
export class AddProductCategoryService {
  constructor(
    private readonly getProductService: GetProductService,
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(
    productCategoryDTO: ProductCategoryDTO,
    product_id: string,
    user: User,
  ): Promise<ResponseDTO<null>> {
    const [product, categories] = await Promise.all([
      this.getProductService.execute(product_id, user),
      this.categoryRepository.getAllByIds(
        Array.from(productCategoryDTO.category_ids),
      ),
    ]);

    if (productCategoryDTO.category_ids.length !== categories.size) {
      throw new BadRequestException('Some categories do not exist');
    }

    const manager = product.addCategories(categories);

    await this.productRepository.updateCategories(product, manager);

    return {
      message: `Categories ${Array.from(categories)
        .map((category) => category.getName())
        .join(', ')} added to product ${product.getName()}`,
    };
  }
}
