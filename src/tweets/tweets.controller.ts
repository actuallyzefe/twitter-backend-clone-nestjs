import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { PostTweetDto } from './dto/post-tweet.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post('tweet')
  @UseInterceptors(FileInterceptor('file'))
  async postTweet(
    @Req() request: Request,
    @Body() tweet?: PostTweetDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.tweetsService.postTweet(request.user, tweet, file);
  }
}
