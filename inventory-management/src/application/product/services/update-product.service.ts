import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class UpdateProductService {
  constructor(private readonly productRepository: ProductRepository) {}
}
