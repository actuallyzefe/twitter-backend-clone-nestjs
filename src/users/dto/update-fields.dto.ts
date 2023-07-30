import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateFieldsDto {
  @IsString()
  @IsOptional()
  @MaxLength(120)
  bio?: string;

  @IsString()
  @IsOptional()
  name?: string;
}
