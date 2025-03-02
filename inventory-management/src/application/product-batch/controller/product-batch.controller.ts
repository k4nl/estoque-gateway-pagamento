import { Controller } from '@nestjs/common';
import {
  CreateProductBatchService,
  GetAllProductBatchService,
  GetProductBatchService,
  UpdateProductBatchQuantityService,
  UpdateProductBatchService,
} from '../service';

@Controller('product-batch')
export class ProductBatchController {
  constructor(
    private readonly createProductBatchService: CreateProductBatchService,
    private readonly getAllProductBatchService: GetAllProductBatchService,
    private readonly getProductBatchService: GetProductBatchService,
    private readonly updateProductBatchQuantityService: UpdateProductBatchQuantityService,
    private readonly updateProductBatchService: UpdateProductBatchService,
  ) {}
}
