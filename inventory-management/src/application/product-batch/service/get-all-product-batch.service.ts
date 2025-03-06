import { Injectable } from '@nestjs/common';
import { ProductBatchRepository } from '../repositories/product-batch.repository';
import { ProductBatchFilterDTO } from '../dto/product-batch-filter.dto';
import { User } from 'src/@core/domain/user/user.domain';
import { Pagination } from 'src/@core/application/pagination/pagination';

@Injectable()
export class GetAllProductBatchService {
  constructor(private readonly repository: ProductBatchRepository) {}

  async execute(filter: ProductBatchFilterDTO, user: User) {
    const pagination = new Pagination({
      limit: filter.limit,
      page: filter.page,
    });

    const { productBatches, total } = await this.repository.getAll({
      from_date: filter.from_date,
      to_date: filter.to_date,
      from_expiration_date: filter.from_expiration_date,
      to_expiration_date: filter.to_expiration_date,
      product_id: filter.product_id,
      user_id: user.getId(),
      offset: pagination.getOffset(),
      limit: pagination.getLimit(),
    });

    pagination.setMetadata(total);

    return {
      productBatches,
      pagination,
    };
  }
}
