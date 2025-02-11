import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { User } from 'src/@core/domain/user/user.domain';
import { ResponseDTO } from 'src/application/common/dto/response.dto';
import { Product } from 'src/@core/domain/product/product.domain';
import { CreateProductDTO } from '../dto/create-product.dto';
import { CategoryRepository } from 'src/application/category/repositories/category.repository';
import { Category } from 'src/@core/domain/category/category.domain';

@Injectable()
export class CreateProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    data: CreateProductDTO,
    user: User,
  ): Promise<ResponseDTO<null>> {
    // validate if product already exists

    const product_exists = await this.productRepository.findByName(
      data.name,
      user.getId(),
    );

    if (product_exists) {
      throw new Error(`Product ${product_exists.getName()} already exists`);
    }

    // validate categories
    const { categories } = await this.categoryRepository.getAll({
      responsible_id: user.getId(),
      name: Array.from(data.categories),
    });

    const categories_set = new Set<Category>();

    for (const category of categories) {
      if (!data.categories.has(category.getName())) {
        throw new Error(`Category ${category.getName()} not found`);
      }

      categories_set.add(category);
    }

    const product = Product.create({
      ...data,
      categories: categories_set,
      user,
    });

    await this.productRepository.create(product);

    return { message: 'Product created successfully' };
  }
}
