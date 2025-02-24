import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/config/database/database.service';
import { UserType } from '@prisma/client';
import { GetAllUsersFilter, GetAllUsersResponse } from './respository.types';
import { UserMapper } from 'src/@core/infra/mappers/user.mapper';
import { User } from 'src/@core/domain/user/user.domain';

@Injectable()
export class UserRepository {
  constructor(private readonly database: DatabaseService) {}

  async getAll(filter: GetAllUsersFilter): Promise<GetAllUsersResponse> {
    const where = {
      user_type: UserType.client,
      created_at: {
        gte: filter.from ? filter.from : undefined,
        lte: filter.to ? filter.to : undefined,
      },
    };

    const [users, total] = await Promise.all([
      this.database.user.findMany({
        where,
        take: filter.limit,
        skip: filter.offset,
      }),

      this.database.user.count({
        where,
      }),
    ]);

    return { users: users.map(UserMapper.toDomain), total };
  }

  async getByExternalId(externalId: string) {
    const user = await this.database.user.findUnique({
      where: {
        external_id: externalId,
      },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async create(user: User) {
    await this.database.user.create({
      data: {
        external_id: user.getExternalId(),
        created_at: user.getCreatedAt(),
        id: user.getId(),
        updated_at: user.getUpdatedAt(),
        user_type: user.getUserType(),
      },
    });
  }
}
