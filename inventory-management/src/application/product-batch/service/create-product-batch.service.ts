import { BadRequestException, Injectable } from '@nestjs/common';
import { ProductBatchRepository } from '../repositories/product-batch.repository';
import { CreateProductBatchDTO } from '../dto/create-product-batch.dto';
import { User } from 'src/@core/domain/user/user.domain';
import { GetProductService } from 'src/application/product/services';
import { ProductBatch } from 'src/@core/domain/product-batch/product-batch.domain';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CreateProductBatchService {
  constructor(
    private readonly getProductService: GetProductService,
    private readonly repository: ProductBatchRepository,
  ) {}

  async execute(createProductBatchDTO: CreateProductBatchDTO, user: User) {
    const product = await this.getProductService.execute(
      createProductBatchDTO.product_id,
      user,
    );

    const product_batch = ProductBatch.create({
      quantity: new Decimal(createProductBatchDTO.quantity),
      expiration_date: createProductBatchDTO.expiration_date,
    });
  }
}
