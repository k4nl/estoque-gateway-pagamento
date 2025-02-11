import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ReserveProductService {
  constructor(private readonly productRepository: ProductRepository) {}
}
