import { Injectable } from '@nestjs/common';
import { ProductBatchRepository } from '../repositories/product-batch.repository';
import { GetProductBatchService } from './get-product-batch.service';
import { User } from 'src/@core/domain/user/user.domain';
import { UpdateProductBatchDTO } from '../dto/update-product-batch.dto';
import { ResponseDTO } from 'src/application/common/dto/response.dto';

@Injectable()
export class UpdateProductBatchService {
  constructor(
    private readonly repository: ProductBatchRepository,
    private readonly getProductBatchService: GetProductBatchService,
  ) {}

  async execute(
    id: string,
    updateProductBatchDTO: UpdateProductBatchDTO,
    user: User,
  ): Promise<ResponseDTO<null>> {
    const product_batch = await this.getProductBatchService.execute(id, user);

    product_batch.update(updateProductBatchDTO);

    await this.repository.update(product_batch);

    return {
      message: 'Product batch updated successfully',
    };
  }
}
