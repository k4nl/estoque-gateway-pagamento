import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../repositories/inventory.repository';
import { User } from 'src/@core/domain/user/user.domain';
import { UserType } from 'src/@core/common/user-type';

@Injectable()
export class GetInventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute(inventory_id: string, user: User) {
    const inventory = await this.inventoryRepository.getById(inventory_id);

    const responsible = inventory.getProduct().getResponsibleId();

    if (responsible !== user.getId() && user.getUserType() !== UserType.ADMIN) {
      throw new Error('Unauthorized');
    }

    return inventory;
  }
}
