import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/@core/domain/user/user.domain';
import { UserMapper } from 'src/@core/infra/mappers/user.mapper';
import { DatabaseService } from 'src/config/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly jwt: JwtService,
  ) {}

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.database.user.findUnique({
      where: {
        external_id: payload.id,
      },
    });

    if (!user) {
      return null;
    }

    const userDomain = UserMapper.toDomain(user);

    return userDomain;
  }

  async createToken(id: string) {
    return this.jwt.sign(
      {
        id,
      },
      {
        secret: process.env.JWT_SECRET,
      },
    );
  }
}

type JwtPayload = {
  user_type: string;
  id: string;
};
