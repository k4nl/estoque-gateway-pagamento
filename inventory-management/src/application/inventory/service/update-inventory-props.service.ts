import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../repositories/inventory.repository';

@Injectable()
export class UpdateInventoryPropsService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute() {}
}
