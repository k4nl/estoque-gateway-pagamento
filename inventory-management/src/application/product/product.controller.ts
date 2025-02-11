import { Body, Controller, Param, Post } from '@nestjs/common';
import {
  CreateProductService,
  AddProductCategoryService,
  DeleteProductService,
  GetAllProductsService,
  GetProductService,
  RemoveProductCategoryService,
  UpdateProductService,
} from './services';
import { GetUser } from '../common/decorators/get-user.decorator';
import { CreateProductDTO } from './dto/create-product.dto';
import { User } from 'src/@core/domain/user/user.domain';
import { Roles } from '../common/decorators/roles.decorator';
import { UserType } from 'src/@core/common/user-type';
import { AddProductCategoryDTO } from './dto/add-product-category.dto';

@Controller('product')
export class ProductController {
  constructor(
    private readonly createProductService: CreateProductService,
    private readonly addProductCategoryService: AddProductCategoryService,
    private readonly deleteProductService: DeleteProductService,
    private readonly getAllProductsService: GetAllProductsService,
    private readonly getProductService: GetProductService,
    private readonly removeProductCategoryService: RemoveProductCategoryService,
    private readonly updateProductService: UpdateProductService,
  ) {}

  @Roles(UserType.CLIENT)
  @Post()
  async createProduct(
    @Body() createProductDTO: CreateProductDTO,
    @GetUser() user: User,
  ) {
    return this.createProductService.execute(createProductDTO, user);
  }

  @Roles(UserType.CLIENT)
  @Post('/:id/add-categories')
  async addProductCategory(
    @Body() addProductCategoryDTO: AddProductCategoryDTO,
    @Param() product_id: string,
    @GetUser() user: User,
  ) {
    return this.addProductCategoryService.execute(
      addProductCategoryDTO,
      product_id,
      user,
    );
  }
}
