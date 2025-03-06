import { Injectable, Logger } from '@nestjs/common';
import { InventoryRepository } from '../repositories/inventory.repository';
import { InventoryUpdatedQuantityDTO } from '../dto/update-quantity.dto';

@Injectable()
export class InventoryUpdateQuantityService {
  private logger = new Logger(InventoryUpdateQuantityService.name);

  constructor(private readonly repository: InventoryRepository) {}

  async execute(
    inventoryUpdatedQuantityDTO: InventoryUpdatedQuantityDTO,
  ): Promise<void> {
    if (
      inventoryUpdatedQuantityDTO.quantity.isNegative() ||
      inventoryUpdatedQuantityDTO.quantity.isZero()
    ) {
      this.logger.error(
        `Quantity must be greater than zero. Inventory ID: ${inventoryUpdatedQuantityDTO.inventory_id}`,
      );

      throw new Error('Quantity must be greater than zero');
    }

    await Promise.all([
      this.repository.createLog(inventoryUpdatedQuantityDTO),
      this.repository.updateQuantity(inventoryUpdatedQuantityDTO),
    ]);
  }
}
