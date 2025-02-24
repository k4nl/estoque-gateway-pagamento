import { UserType } from '@prisma/client';
import { BaseSeed, SeedRunner } from './seed';
import { v4 as uuidv4 } from 'uuid';

export class UsersSeed extends BaseSeed implements SeedRunner {
  async run(): Promise<void> {
    const admin = await this.database.user.findFirst({
      where: { user_type: UserType.admin },
    });

    if (!admin) {
      await this.database.user.create({
        data: {
          created_at: new Date(),
          external_id: uuidv4().toString(),
          id: uuidv4().toString(),
          updated_at: new Date(),
          user_type: UserType.admin,
        },
      });
    }

    await this.database.user.createMany({
      data: Array.from({ length: 1000 }, () => {
        return {
          created_at: new Date(),
          external_id: uuidv4().toString(),
          id: uuidv4().toString(),
          updated_at: new Date(),
          user_type: UserType.client,
        };
      }),
    });
  }
}
