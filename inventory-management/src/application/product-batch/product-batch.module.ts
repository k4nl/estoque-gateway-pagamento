import { Module } from '@nestjs/common';
import { ProductBatchRepository } from './repositories/product-batch.repository';
import {
  CreateProductBatchService,
  GetAllProductBatchService,
  GetProductBatchService,
  UpdateProductBatchQuantityService,
  UpdateProductBatchService,
} from './service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    ProductBatchRepository,
    CreateProductBatchService,
    GetAllProductBatchService,
    GetProductBatchService,
    UpdateProductBatchQuantityService,
    UpdateProductBatchService,
  ],
  exports: [],
})
export class ProductBatchModule {}
