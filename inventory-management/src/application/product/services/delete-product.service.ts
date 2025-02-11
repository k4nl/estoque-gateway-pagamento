import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class DeleteProductService {
  constructor(private readonly productRepository: ProductRepository) {}
}
