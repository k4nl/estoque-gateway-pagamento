import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class RemoveProductCategoryService {
  constructor(private readonly productRepository: ProductRepository) {}
}
