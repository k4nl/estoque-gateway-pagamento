import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { ProductFilterDTO } from '../dto/product-filter.dto';
import { User } from 'src/@core/domain/user/user.domain';
import { Pagination } from 'src/@core/application/pagination/pagination';

@Injectable()
export class GetAllProductsService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(productFilterDTO: ProductFilterDTO, user: User) {
    const pagination = new Pagination({
      page: productFilterDTO.page,
      limit: productFilterDTO.limit,
    });

    const { products, total } = await this.productRepository.getAll({
      name: productFilterDTO.name,
      created_at: productFilterDTO.created_at,
      user_id: user.getId(),
      offset: pagination.getOffset(),
      limit: pagination.getLimit(),
    });

    pagination.setMetadata(total);

    return {
      products,
      pagination,
    };
  }
}
