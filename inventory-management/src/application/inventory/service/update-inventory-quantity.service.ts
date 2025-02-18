import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../repositories/inventory.repository';

@Injectable()
export class UpdateInventoryQuantityService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute() {}
}
