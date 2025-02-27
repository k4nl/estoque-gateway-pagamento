import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateProductService,
  AddProductCategoryService,
  DeleteProductService,
  GetAllProductsService,
  GetProductService,
  RemoveProductCategoryService,
  UpdateProductService,
} from '../services';
import { User } from 'src/@core/domain/user/user.domain';
import { UserType } from 'src/@core/common/user-type';
import { Roles } from 'src/application/common/decorators/roles.decorator';
import { GetUser } from 'src/application/common/decorators/get-user.decorator';
import { CreateProductDTO } from '../dto/create-product.dto';
import { ProductCategoryDTO } from '../dto/add-product-category.dto';
import { ProductFilterDTO } from '../dto/product-filter.dto';
import { ProductIdDTO } from '../dto/product-id.dto';

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
  @Patch('/:id/add-categories')
  async addProductCategory(
    @Body() addProductCategoryDTO: ProductCategoryDTO,
    @Param() product_id: ProductIdDTO,
    @GetUser() user: User,
  ) {
    return this.addProductCategoryService.execute(
      addProductCategoryDTO,
      product_id.id,
      user,
    );
  }

  @Roles(UserType.CLIENT)
  @Patch('/:id/remove-categories')
  async removeProductCategory(
    @Body() removeProductCategoryDTO: ProductCategoryDTO,
    @Param() product_id: ProductIdDTO,
    @GetUser() user: User,
  ) {
    return this.removeProductCategoryService.execute(
      removeProductCategoryDTO,
      product_id.id,
      user,
    );
  }

  @Roles(UserType.ADMIN, UserType.CLIENT)
  @Get()
  async getAllProducts(
    @Query() productFilterDTO: ProductFilterDTO,
    @GetUser() user: User,
  ) {
    return this.getAllProductsService.execute(productFilterDTO, user);
  }

  @Roles(UserType.ADMIN, UserType.CLIENT)
  @Get('/:id')
  async getProduct(@Param() param: ProductIdDTO, @GetUser() user: User) {
    return this.getProductService.execute(param.id, user);
  }
}
