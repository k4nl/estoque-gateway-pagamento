import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './repositories/category.repository';
import {
  CreateCategoryService,
  DeleteCategoryService,
  GetAllCategoriesService,
  GetCategoryService,
} from './services';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [
    CategoryRepository,
    CreateCategoryService,
    DeleteCategoryService,
    GetAllCategoriesService,
    CategoryRepository,
    GetCategoryService,
  ],
  exports: [],
})
export class CategoryModule {}
