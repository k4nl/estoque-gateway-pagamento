import { Module } from '@nestjs/common';
import { InventoryRepository } from './repositories/inventory.repository';
import {
  AlertOnLowStockService,
  GetAllCategoriesService,
  GetInventoryService,
  UpdateProductService,
} from './service';
import { CategoryRepository } from '../category/repositories/category.repository';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule],
  controllers: [],
  providers: [
    AlertOnLowStockService,
    GetAllCategoriesService,
    GetInventoryService,
    UpdateProductService,
    InventoryRepository,
    CategoryRepository,
  ],
  exports: [AlertOnLowStockService],
})
export class InventoryModule {}
