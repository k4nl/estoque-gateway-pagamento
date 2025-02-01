/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class Userservice {
  async create(createUserDto: CreateUserDto): Promise<void> {
    console.log('usuario criado');
  }
}
