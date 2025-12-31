// auth/auth.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { FakeDatabaseService } from '../database/fake-database.service'; // Adjust path as needed
import { LoginDto } from './auth.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly db: FakeDatabaseService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
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
    const encodedPayload = btoa(JSON.stringify(tokenPayload));
    const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${encodedPayload}.fake-signature`;

    // return the success response
    return {
      access_token: fakeToken,
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
