import { Injectable } from '@nestjs/common';
import { ProductBatchRepository } from '../repositories/product-batch.repository';

@Injectable()
export class GetProductBatchService {
  constructor(private readonly repository: ProductBatchRepository) {}

  execute() {}
}
