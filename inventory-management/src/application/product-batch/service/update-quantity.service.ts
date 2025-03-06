import { Injectable } from '@nestjs/common';
import { ProductBatchRepository } from '../repositories/product-batch.repository';
import { UpdateProductBatchQuantityDTO } from '../dto/update-product-batch-quantity.dto';
import { User } from 'src/@core/domain/user/user.domain';
import { GetProductBatchService } from './get-product-batch.service';
import { ResponseDTO } from 'src/application/common/dto/response.dto';

@Injectable()
export class UpdateProductBatchQuantityService {
  constructor(
    private readonly repository: ProductBatchRepository,
    private readonly getProductBatchService: GetProductBatchService,
  ) {}

  async execute(
    id: string,
    updateProductBatchQuantityDTO: UpdateProductBatchQuantityDTO,
    user: User,
  ): Promise<ResponseDTO<null>> {
    const product_batch = await this.getProductBatchService.execute(id, user);

    const product_batch_manager = product_batch.updateQuantity(
      updateProductBatchQuantityDTO,
    );

    await this.repository.updateQuantity(product_batch_manager);

    return {
      message: 'Product batch quantity updated successfully',
    };
  }
}
