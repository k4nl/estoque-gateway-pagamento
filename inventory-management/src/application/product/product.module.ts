import { Module } from '@nestjs/common';
import { ProductRepository } from './repositories/product.repository';
import {
  AddProductCategoryService,
  CreateProductService,
  DeleteProductService,
  GetAllProductsService,
  GetProductService,
  RemoveProductCategoryService,
  UpdateProductService,
} from './services';
import { CategoryRepository } from '../category/repositories/category.repository';
import { ProductController } from './controller/product.controller';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [
    ProductRepository,
    AddProductCategoryService,
    CreateProductService,
    DeleteProductService,
    GetAllProductsService,
    RemoveProductCategoryService,
    UpdateProductService,
    GetProductService,
    CategoryRepository,
  ],
  exports: [
    ProductRepository,
    AddProductCategoryService,
    CreateProductService,
    DeleteProductService,
    GetAllProductsService,
    RemoveProductCategoryService,
    UpdateProductService,
    GetProductService,
  ],
})
export class ProductModule {}
