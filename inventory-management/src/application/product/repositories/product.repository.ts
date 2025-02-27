import { Injectable } from '@nestjs/common';
import { DigitalProduct } from 'src/@core/domain/product/digital-product.domain';
import { PhysicalProduct } from 'src/@core/domain/product/physical-product.domain';
import { Product } from 'src/@core/domain/product/product.domain';
import { ProductMapper } from 'src/@core/infra/mappers/product.mapper';
import { DatabaseService } from 'src/config/database/database.service';
import { ReservationType } from '@prisma/client';
import { GetAllProductsFilter } from './repository.types';
import { Uuid } from 'src/@core/value-object';
import { Category } from 'src/@core/domain/category/category.domain';
import { ProductCategoryManager } from 'src/@core/domain/category/product-category-manager.domain';
import { ProductCategoryMapper } from 'src/@core/infra/mappers/product-category.mapper';

@Injectable()
export class ProductRepository {
  constructor(private readonly database: DatabaseService) {}

  async findByName(
    name: string,
    user_id: string,
  ): Promise<Product | DigitalProduct | PhysicalProduct | null> {
    const productModel = await this.database.product.findUnique({
      where: {
        name_user_id: {
          name,
          user_id,
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        digital_product: true,
        physical_product: true,
        product_batches: true,
        inventory: true,
        user: true,
      },
    });

    if (!productModel) {
      return null;
    }

    return ProductMapper.toDomain(productModel);
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.database.product.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        digital_product: true,
        physical_product: true,
        product_batches: true,
        inventory: true,
        user: true,
      },
    });

    if (!product) {
      return null;
    }

    return ProductMapper.toDomain(product);
  }

  async create(
    product: Product | DigitalProduct | PhysicalProduct,
  ): Promise<void> {
    const productModel = ProductMapper.toDatabase(product);

    await this.database.product.create({
      data: {
        id: productModel.id,
        name: productModel.name,
        description: productModel.description,
        reservation_type: productModel.reservation_type,
        categories: {
          createMany: {
            data: productModel.categories.map((category) => ({
              id: new Uuid().value,
              category_id: category.id,
            })),
          },
        },
        user_id: productModel.user_id,
        created_at: productModel.created_at,
        updated_at: productModel.updated_at,
        inventory: {
          create: {
            quantity: productModel.inventory.quantity,
            alert_on_low_stock: productModel.inventory.alert_on_low_stock,
            created_at: productModel.inventory.created_at,
            id: productModel.inventory.id,
            updated_at: productModel.inventory.updated_at,
            minimum_stock: productModel.inventory.minimum_stock,
          },
        },
        product_batches: productModel.product_batches
          ? {
              createMany: {
                data: productModel.product_batches,
              },
            }
          : undefined,
        digital_product: productModel.digital_product
          ? {
              create: {
                url: productModel.digital_product.url,
              },
            }
          : undefined,
        physical_product: productModel.physical_product
          ? {
              create: {
                expiration_date: productModel.physical_product.expiration_date,
                perishable: productModel.physical_product.perishable,
              },
            }
          : undefined,
      },
    });
  }

  async updateCategories(
    product: Product,
    manager: ProductCategoryManager,
  ): Promise<void> {
    const product_category_mapper = ProductCategoryMapper.toDatabase(
      manager,
      product.getId(),
    );

    await this.database.product.update({
      where: { id: product.getId() },
      data: {
        categories: product_category_mapper,
      },
    });
  }

  async update(product: Product): Promise<void> {
    const productModel = ProductMapper.toDatabase(product);

    await this.database.product.update({
      where: { id: productModel.id },
      data: {
        description: productModel.description,
        reservation_type: productModel.reservation_type,
        updated_at: productModel.updated_at,
        digital_product: productModel.digital_product
          ? {
              update: {
                where: { product_id: productModel.id },
                data: {
                  url: productModel.digital_product.url,
                },
              },
            }
          : undefined,
        physical_product: productModel.physical_product
          ? {
              update: {
                where: { product_id: productModel.id },
                data: {
                  expiration_date:
                    productModel.physical_product.expiration_date,
                  perishable: productModel.physical_product.perishable,
                },
              },
            }
          : undefined,
      },
    });
  }

  async getAll(
    filter: GetAllProductsFilter,
  ): Promise<{ products: Product[] } & { total: number }> {
    const reservation_type = filter.reservation_type
      ? ReservationType[filter.reservation_type] ||
        new Error('Invalid reservation type')
      : undefined;

    if (reservation_type?.constructor === Error) {
      throw reservation_type;
    }

    const where = {
      name: filter.name
        ? {
            startsWith: filter.name,
          }
        : undefined,
      description: filter.description
        ? {
            contains: filter.description,
          }
        : undefined,
      created_at: filter.created_at
        ? {
            gte: filter.created_at,
          }
        : undefined,
      reservation_type,
      user_id: filter.user_id,
    };

    const [products, total] = await Promise.all([
      this.database.product.findMany({
        where,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          digital_product: true,
          physical_product: true,
          product_batches: true,
          inventory: true,
          user: true,
        },
        skip: filter.offset,
        take: filter.limit,
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.database.product.count({
        where,
      }),
    ]);

    return {
      products: products.map(ProductMapper.toDomain),
      total,
    };
  }

  async delete(id: string): Promise<void> {
    await this.database.product.delete({
      where: { id },
    });
  }
}
