import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductBatchRepository } from '../repositories/product-batch.repository';
import { ProductBatch } from 'src/@core/domain/product-batch/product-batch.domain';
import { User } from 'src/@core/domain/user/user.domain';

@Injectable()
export class GetProductBatchService {
  constructor(private readonly repository: ProductBatchRepository) {}

  async execute(id: string, user: User): Promise<ProductBatch> {
    const productBatch = await this.repository.findById(id, user);

    if (!productBatch) {
      throw new NotFoundException(`Product batch not found`);
    }

    return productBatch;
  }
}
