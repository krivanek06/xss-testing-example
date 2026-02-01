// auth/auth.controller.ts
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FakeDatabaseService } from '../database/fake-database.service'; // Adjust path as needed
import { LoginDto, UpdateUserDto } from './auth.model';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly db: FakeDatabaseService,
    private readonly jwtService: JwtService
  ) {}

  @Post('authenticate')
  @HttpCode(HttpStatus.OK)
  authenticateWithToken(@Body('token') token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const users = this.db.getUsers();
      const user = users.find(u => u.id === decoded.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      console.error('Token verification failed:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

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

  @Put('user/:id')
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    // check if user exists
    const users = this.db.getUsers();
    const existingUser = users.find(u => u.id === id);

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // update user in the fake DB
    this.db.update('users', id, updateUserDto);

    // return the updated user
    const updatedUser = this.db.getUsers().find(u => u.id === id);
    return updatedUser;
  }
}
