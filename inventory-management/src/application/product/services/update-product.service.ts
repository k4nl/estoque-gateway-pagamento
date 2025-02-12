import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { GetProductService } from './get-product.service';
import { User } from 'src/@core/domain/user/user.domain';

@Injectable()
export class UpdateProductService {
  constructor(
    private readonly getProductService: GetProductService,
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(updateProductDTO: any, product_id: string, user: User) {
    const product = await this.getProductService.execute(product_id, user);

    product.update(updateProductDTO);

    await this.productRepository.update(product);

    return {
      message: `Product ${product.getName()} updated successfully`,
    };
  }
}
