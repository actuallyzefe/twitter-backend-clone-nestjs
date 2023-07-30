import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UpdateFieldsDto } from './dto/update-fields.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Patch('follow-unfollow/:userid')
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

  @Get()
  async findAll() {
    return this.userService.findAllUsers();
  }

  @Patch('update-me')
  @UseInterceptors(FileInterceptor('file'))
  async updateMe(
    @Req() request: Request,
    @Body() updateFields?: UpdateFieldsDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.userService.updateMe(request.user, updateFields, file);
  }
}
