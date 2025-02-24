import { Product, ReservationType, UserType } from '@prisma/client';
import { BaseSeed, SeedRunner } from './seed';
import { v4 as uuidv4 } from 'uuid';

export class ProductsInventoriesSeed extends BaseSeed implements SeedRunner {
  private async seedProducts(): Promise<Product[]> {
    const users = await this.database.user.findMany();
    const categories = await this.database.category.findMany();
    const products_already_created = await this.database.product.findMany();

    if (products_already_created.length) {
      return products_already_created;
    }

    const has_client = users.some((user) => user.user_type === UserType.client);

    if (!users.length || !has_client) {
      throw new Error('No users found');
    }

    if (!categories.length) {
      throw new Error('No categories found');
    }

    // for each user create 3 products

    const promises = [];

    const digital_category_id =
      categories.find((category) => category.name === 'courses').id || null;

    for (const user of users) {
      for (let i = 0; i < 3; i++) {
        const random_date = new Date();
        random_date.setDate(
          random_date.getDate() + Math.floor(Math.random() * 30),
        );

        const is_digital = Math.random() > 0.7;

        const random_categories = Math.floor(Math.random() * categories.length);

        const categories_ids = categories.filter((category, index) => {
          return index < random_categories && category.name !== 'courses';
        });

        promises.push(
          this.database.product.create({
            data: {
              id: uuidv4().toString(),
              name: `Product ${i + 1}`,
              description: `Product ${i + 1} description`,
              reservation_type: ReservationType.reservable,
              user: {
                connect: {
                  id: user.id,
                },
              },
              created_at: new Date(),
              updated_at: new Date(),
              categories: is_digital
                ? {
                    create: {
                      category_id: digital_category_id,
                      id: uuidv4().toString(),
                    },
                  }
                : {
                    createMany: {
                      data: categories_ids.map((category) => ({
                        id: uuidv4().toString(),
                        category_id: category.id,
                      })),
                    },
                  },
              digital_product: is_digital
                ? {
                    create: {
                      url: 'https://www.udemy.com',
                    },
                  }
                : undefined,
              physical_product: is_digital
                ? undefined
                : {
                    create: {
                      expiration_date: random_date,
                      perishable: Math.random() > 0.3,
                    },
                  },
              product_batches: {
                createMany: {
                  data: this.createProductBatch(is_digital, random_date),
                },
              },
              inventory: {
                create: {
                  created_at: new Date(),
                  id: uuidv4().toString(),
                  updated_at: new Date(),
                  quantity: Math.floor(Math.random() * (100 - 1) + 1),
                  alert_on_low_stock: Math.random() > 0.5,
                  minimum_stock: Math.floor(Math.random() * (100 - 1) + 1),
                },
              },
            },
          }),
        );
      }
    }

    await Promise.all(promises);
  }

  private createProductBatch(is_digital: boolean, random_date: Date) {
    return Array.from({ length: 5 }, () => {
      return {
        id: uuidv4().toString(),
        quantity: Math.floor(Math.random() * (100 - 1) + 1),
        expiration_date: is_digital ? null : random_date,
        created_at: new Date(),
        updated_at: new Date(),
      };
    });
  }

  async run(): Promise<void> {
    await this.seedProducts();
  }
}
