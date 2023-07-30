import { IsEmail } from 'class-validator';

export class askVerifyDto {
  @IsEmail()
  email: string;
}
