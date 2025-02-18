import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../repositories/inventory.repository';
import { InventoryFilterDTO } from '../dto/inventory-filter.dto';
import { User } from 'src/@core/domain/user/user.domain';
import { UserType } from 'src/@core/common/user-type';
import { Pagination } from 'src/@core/application/pagination/pagination';

@Injectable()
export class GetAllInventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute(filter: InventoryFilterDTO, user: User) {
    const is_admin = user.getUserType() === UserType.ADMIN;

    if (!is_admin && filter.user_id) {
      // only admin users can filter by user_id
      throw new Error('Unauthorized');
    }

    const pagination = new Pagination({
      page: filter.page,
      limit: filter.limit,
    });

    const { inventories, total } = await this.inventoryRepository.getAll({
      from: filter.from_date,
      to: filter.to_date,
      user_id: is_admin ? filter.user_id : user.getId(),
      offset: pagination.getOffset(),
      limit: pagination.getLimit(),
      alert_on_low_stock: filter.has_alert_on_low_stock,
      reservation_type: filter.reservation_type,
      quantity: filter.quantity,
      products_name: filter.products_name,
      minimum_stock: filter.minimum_stock,
    });

    pagination.setMetadata(total);

    return {
      inventories,
      pagination,
    };
  }
}
