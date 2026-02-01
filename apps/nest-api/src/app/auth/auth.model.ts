// auth/dto/login.dto.ts
export class LoginDto {
  username!: string;
  password!: string;
}

export class UpdateUserDto {
  fullName?: string;
  avatar?: string; // accept the URL or the raw SVG string/Base64
}
