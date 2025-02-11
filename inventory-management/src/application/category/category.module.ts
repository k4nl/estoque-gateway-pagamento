import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CreateCategoryService } from './services';

@Module({
  imports: [],
  controllers: [CategoryController],
  providers: [CategoryRepository, CreateCategoryService],
  exports: [],
})
export class CategoryModule {}
