import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateCategoryService,
  DeleteCategoryService,
  GetAllCategoriesService,
  GetCategoryService,
} from './services';
import { Roles } from '../common/decorators/roles.decorator';
import { UserType } from 'src/@core/common/user-type';
import { CreateCategoryDTO } from './dto/create-category.dto';
import { GetUser } from '../common/decorators/get-user.decorator';
import { User } from 'src/@core/domain/user/user.domain';
import { CategoryFilterDTO, CategoryIdDTO } from './dto/category-filter.dto';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly createCategoryService: CreateCategoryService,
    private readonly getAllCategoriesService: GetAllCategoriesService,
    private readonly getCategoryService: GetCategoryService,
    private readonly deleteCategoryService: DeleteCategoryService,
  ) {}

  @Roles(UserType.ADMIN, UserType.CLIENT)
  @Post()
  createCategory(@Body() data: CreateCategoryDTO, @GetUser() user: User) {
    return this.createCategoryService.execute(data, user);
  }

  @Roles(UserType.ADMIN, UserType.CLIENT)
  @Get('/:id')
  getCategory(@Param() category: CategoryIdDTO, @GetUser() user: User) {
    return this.getCategoryService.execute(category.id, user);
  }

  @Roles(UserType.ADMIN, UserType.CLIENT)
  @Get('/')
  getCategories(@Query() query: CategoryFilterDTO, @GetUser() user: User) {
    return this.getAllCategoriesService.execute(query, user);
  }

  @Roles(UserType.ADMIN, UserType.CLIENT)
  @Delete('/:id')
  deleteCategory(@Param() category: CategoryIdDTO, @GetUser() user: User) {
    return this.deleteCategoryService.execute(category.id, user);
  }

  // Other routes...
}
