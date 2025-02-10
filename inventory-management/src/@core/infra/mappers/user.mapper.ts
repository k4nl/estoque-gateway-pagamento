import { User as UserDomain } from 'src/@core/domain/user/user.domain';
import { User as UserModel } from '@prisma/client';
import { UserType } from 'src/@core/common/user-type';

export class UserMapper {
  public static toDatabase(user: UserDomain): UserModel {
    return {
      id: user.getId().value,
      external_id: user.getExternalId().value,
      user_type: user.getUserType(),
      created_at: user.getCreatedAt(),
      updated_at: user.getUpdatedAt(),
    };
  }

  public static toDomain(userEntity: UserModel): UserDomain {
    return new UserDomain({
      id: userEntity.id,
      external_id: userEntity.external_id,
      user_type: userEntity.user_type as UserType,
      created_at: userEntity.created_at,
      updated_at: userEntity.updated_at,
    });
  }
}
