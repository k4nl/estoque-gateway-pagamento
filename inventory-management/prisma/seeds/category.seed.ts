import { BaseSeed, SeedRunner } from './seed';
import { v4 as uuidv4 } from 'uuid';

export class CategoySeed extends BaseSeed implements SeedRunner {
  async run(): Promise<void> {
    const categories = await this.database.category.findMany();

    const publicCategories = [
      'clothes',
      'shoes',
      'bags',
      'accessories',
      'courses',
      'books',
      'electronics',
      'furniture',
      'appliances',
      'services',
    ];

    const missingCategories = publicCategories.filter(
      (category) => !categories.find((c) => c.name === category),
    );

    await this.database.category.createMany({
      data: missingCategories.map((category) => {
        return {
          name: category,
          created_at: new Date(),
          updated_at: new Date(),
          id: uuidv4().toString(),
          responsible_id: null,
        };
      }),
    });
  }
}
