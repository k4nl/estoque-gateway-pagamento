import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateProductBatchService,
  GetAllProductBatchService,
  GetProductBatchService,
  UpdateProductBatchQuantityService,
  UpdateProductBatchService,
} from '../service';
import { GetUser } from 'src/application/common/decorators/get-user.decorator';
import { User } from 'src/@core/domain/user/user.domain';
import { CreateProductBatchDTO } from '../dto/create-product-batch.dto';
import { ProductBatchIdDTO } from '../dto/product-batch-id.dto';
import { ProductBatchFilterDTO } from '../dto/product-batch-filter.dto';
import { UpdateProductBatchDTO } from '../dto/update-product-batch.dto';
import { UpdateProductBatchQuantityDTO } from '../dto/update-product-batch-quantity.dto';

@Controller('product-batch')
export class ProductBatchController {
  constructor(
    private readonly createProductBatchService: CreateProductBatchService,
    private readonly getAllProductBatchService: GetAllProductBatchService,
    private readonly getProductBatchService: GetProductBatchService,
    private readonly updateProductBatchQuantityService: UpdateProductBatchQuantityService,
    private readonly updateProductBatchService: UpdateProductBatchService,
  ) {}

  @Post()
  async createProductBatch(
    @Body() createProductBatchDTO: CreateProductBatchDTO,
    @GetUser() user: User,
  ) {
    return this.createProductBatchService.execute(createProductBatchDTO, user);
  }

  @Get(':id')
  async getProductBatch(
    @GetUser() user: User,
    @Param() param: ProductBatchIdDTO,
  ) {
    return this.getProductBatchService.execute(param.id, user);
  }

  @Get()
  async getAllProductBatch(
    @GetUser() user: User,
    @Query() query: ProductBatchFilterDTO,
  ) {
    return this.getAllProductBatchService.execute(query, user);
  }

  @Patch(':id/quantity')
  async updateProductBatchQuantity(
    @GetUser() user: User,
    @Param() param: ProductBatchIdDTO,
    @Body() updateProductBatchQuantityDTO: UpdateProductBatchQuantityDTO,
  ) {
    return this.updateProductBatchQuantityService.execute(
      param.id,
      updateProductBatchQuantityDTO,
      user,
    );
  }

  @Patch(':id')
  async updateProductBatch(
    @GetUser() user: User,
    @Param() param: ProductBatchIdDTO,
    @Body() updateProductBatchDTO: UpdateProductBatchDTO,
  ) {
    return this.updateProductBatchService.execute(
      param.id,
      updateProductBatchDTO,
      user,
    );
  }
}
