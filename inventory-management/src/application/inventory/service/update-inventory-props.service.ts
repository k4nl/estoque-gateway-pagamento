import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../repositories/inventory.repository';
import { UpdateInventoryDTO } from '../dto/update-inventory.dto';
import { User } from 'src/@core/domain/user/user.domain';
import { GetInventoryService } from './get-inventory.service';

@Injectable()
export class UpdateInventoryPropsService {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly getInventoryService: GetInventoryService,
  ) {}

  async execute(
    inventory_id: string,
    updateInventoryDTO: UpdateInventoryDTO,
    user: User,
  ) {
    const inventory = await this.getInventoryService.execute(
      inventory_id,
      user,
    );

    inventory.update(updateInventoryDTO);

    await this.inventoryRepository.update(inventory);

    return inventory;
  }
}
