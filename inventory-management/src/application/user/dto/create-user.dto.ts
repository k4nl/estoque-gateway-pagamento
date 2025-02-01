import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({
    message: 'user_id must be a string',
  })
  readonly user_id: string;
}
