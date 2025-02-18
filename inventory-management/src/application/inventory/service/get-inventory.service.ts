import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../repositories/inventory.repository';

@Injectable()
export class GetInventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute() {}
}
