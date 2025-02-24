import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { CreateTokenDTO } from '../dto/jwt-token.dto';
import { IsPublic } from '../../decorators/is-public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @Post('token')
  async createToken(@Body() data: CreateTokenDTO) {
    const token = await this.authService.createToken(data.id);

    return { token };
  }
}
