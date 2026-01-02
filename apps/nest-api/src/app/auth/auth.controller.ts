// auth/auth.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FakeDatabaseService } from '../database/fake-database.service'; // Adjust path as needed
import { LoginDto } from './auth.model';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly db: FakeDatabaseService,
    private readonly jwtService: JwtService
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;

    // find the user in our fake DB
    const users = this.db.getUsers();
    const user = users.find(u => u.username === username);

    // validate Credentials
    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // generate a fake JWT token (for demonstration purposes only)
    const tokenPayload = {
      sub: user.id,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      avatar: user.avatar,
    };

    // simple Base64 encoding to look like a JWT payload
    const access_token = await this.jwtService.signAsync(tokenPayload);

    // return the success response
    return {
      access_token: access_token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        avatar: user.avatar,
      },
    };
  }
}
