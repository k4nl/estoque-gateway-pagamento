import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

export class BaseSeed {
  protected database: PrismaClient;
  constructor(database: PrismaClient) {
    this.database = database;
  }
}

export interface SeedRunner {
  run(): Promise<void>;
}

class Seed {
  private orderFiles(files: string[]) {
    const order = ['users', 'category', 'products-inventories', 'reservations'];

    const orderedFiles: string[] = [];

    for (const keyword of order) {
      const matchingFile = files.find((file) => file === `${keyword}.seed.ts`);
      if (matchingFile) {
        orderedFiles.push(matchingFile);
      }
    }

    return orderedFiles;
  }

  private getFiles() {
    const files = fs
      .readdirSync(__dirname)
      .filter((file) => file.includes('.seed.ts'));

    return this.orderFiles(files);
  }

  public async runSeeds() {
    const files = this.getFiles();
    const database = new PrismaClient();

    for (const fileName of files) {
      const module = await import(`./${fileName}`);

      const SeedClass = Object.values(module)[0] as new (
        database: PrismaClient,
      ) => SeedRunner;

      const seed = new SeedClass(database);

      await seed.run();
    }
  }
}

const seed = new Seed();

seed
  .runSeeds()
  .then(() => {
    console.log('Seeds ran successfully');
  })
  .catch((error) => {
    console.error('Error running seeds', error);
  });
