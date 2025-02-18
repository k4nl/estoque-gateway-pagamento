import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { User } from 'src/@core/domain/user/user.domain';

@Injectable()
export class GetUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(external_id: string, user: User) {
    return this.userRepository.getByExternalId(external_id, user);
  }
}
