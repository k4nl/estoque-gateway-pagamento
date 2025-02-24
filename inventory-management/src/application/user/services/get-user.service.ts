import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class GetUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(external_id: string) {
    const userFound = await this.userRepository.getByExternalId(external_id);

    if (!userFound) {
      throw new Error(`User with external id ${external_id} not found`);
    }

    return userFound;
  }
}
