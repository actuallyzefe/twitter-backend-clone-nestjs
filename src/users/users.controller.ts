import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('follow-unfollow/:userid')
  async followUnfollow(
    @Req() request: Request,
    @Param('userid') userId: string,
  ) {
    return this.userService.followUnFollowLogic(userId, request.user);
  }

  @Get('me')
  async getMe(@Req() request: Request) {
    return this.userService.getMe(request.user);
  }
}
