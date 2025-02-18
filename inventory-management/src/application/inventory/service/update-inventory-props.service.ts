import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../repositories/inventory.repository';
import { UpdateInventoryDTO } from '../dto/update-inventory.dto';
import { User } from 'src/@core/domain/user/user.domain';

@Injectable()
export class UpdateInventoryPropsService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute(
    inventory_id: string,
    updateInventoryDTO: UpdateInventoryDTO,
    user: User,
  ) {
    const inventory = await this.inventoryRepository.getById(inventory_id);

    const responsible = inventory.getProduct().getResponsibleId();

    if (responsible !== user.getId()) {
      throw new Error('Unauthorized');
    }

    inventory.update(updateInventoryDTO);

    await this.inventoryRepository.update(inventory);

    return inventory;
  }
}
