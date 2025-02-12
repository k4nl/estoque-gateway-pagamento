import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { User } from 'src/@core/domain/user/user.domain';
import { GetProductService } from './get-product.service';
import { ResponseDTO } from 'src/application/common/dto/response.dto';

@Injectable()
export class DeleteProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly getProductService: GetProductService,
  ) {}

  async execute(product_id: string, user: User): Promise<ResponseDTO<null>> {
    const product = await this.getProductService.execute(product_id, user);

    await this.productRepository.delete(product.getId());

    return {
      message: `Product ${product.getName()} deleted successfully`,
    };
  }
}
