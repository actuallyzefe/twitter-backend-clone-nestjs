import { IsNumber, IsEmail } from 'class-validator';

export class VerifyDto {
  @IsNumber()
  verifyCode: number;

  @IsEmail()
  email: string;
}
