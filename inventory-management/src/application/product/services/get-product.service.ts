import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { User } from 'src/@core/domain/user/user.domain';
import { Product } from 'src/@core/domain/product/product.domain';

@Injectable()
export class GetProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(product_id: string, user: User): Promise<Product> {
    const product = await this.productRepository.findById(product_id);

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.getResponsibleId() !== user.getId()) {
      throw new Error('You are not allowed to access this product');
    }

    return product;
  }
}
