import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from 'src/@core/domain/user/user.domain';
import { UserType } from 'src/@core/common/user-type';

@Injectable()
export class CreateUserService {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(createUserDto: CreateUserDto) {
    const userFound = await this.userRepository.getByExternalId(
      createUserDto.user_id,
    );

    if (userFound) {
      throw new Error(
        `User with external id ${createUserDto.user_id} already exists`,
      );
    }

    const newUser = User.create({
      external_id: createUserDto.user_id,
      user_type: UserType.CLIENT,
    });

    return this.userRepository.create(newUser);
  }
}
