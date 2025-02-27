import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { User } from 'src/@core/domain/user/user.domain';
import { ResponseDTO } from 'src/application/common/dto/response.dto';
import { Product } from 'src/@core/domain/product/product.domain';
import { CreateProductDTO } from '../dto/create-product.dto';
import { CategoryRepository } from 'src/application/category/repositories/category.repository';
import { Category } from 'src/@core/domain/category/category.domain';
import { DigitalProduct } from 'src/@core/domain/product/digital-product.domain';

@Injectable()
export class CreateProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async execute(
    createProductDto: CreateProductDTO,
    user: User,
  ): Promise<ResponseDTO<null>> {
    // validate if product already exists

    const product_exists = await this.productRepository.findByName(
      createProductDto.name,
      user.getId(),
    );

    if (product_exists) {
      throw new ConflictException(
        `Product ${product_exists.getName()} already exists`,
      );
    }

    // Get User Categories
    const { categories } = createProductDto.categories?.size
      ? await this.categoryRepository.getAll({
          responsible_id: user.getId(),
          name: Array.from(createProductDto.categories),
        })
      : { categories: new Set<Category>() };

    let product: Product;

    if (createProductDto.digital) {
      product = DigitalProduct.create({
        ...createProductDto,
        user,
        categories: new Set(categories),
        url: createProductDto.digital.url,
      });
    }

    if (createProductDto.physical) {
      product = Product.create({
        ...createProductDto,
        user,
        categories: new Set(categories),
      });
    }

    if (!product) {
      throw new BadRequestException('Product must be digital or physical');
    }

    await this.productRepository.create(product);

    return { message: 'Product created successfully' };
  }
}
