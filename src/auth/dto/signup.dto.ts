import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Roles } from 'src/users/models/user.model';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  nickname: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  bio?: string;

  role: Roles;

  @IsOptional()
  avatar?: string;

  followers: [];

  followings: [];
}
