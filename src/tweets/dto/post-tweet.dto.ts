import { IsOptional, IsString, MaxLength } from 'class-validator';

export class PostTweetDto {
  @IsString()
  @IsOptional()
  @MaxLength(120)
  tweet?: string;
}
