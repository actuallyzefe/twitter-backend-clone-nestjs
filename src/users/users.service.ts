import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserDocument } from './models/user.model';
import { UserHelperService } from 'src/utils/users/users-helper.service';
import { AwsService } from 'src/aws/aws.service';
import { UpdateFieldsDto } from './dto/update-fields.dto';

@Injectable()
export class UsersService {
  constructor(
    private userHelperService: UserHelperService,
    private readonly awsService: AwsService,
  ) {}

  async getMe(user: UserDocument) {
    return user;
  }

  async findAllUsers() {
    return this.userHelperService.findAll();
  }

  async followUnFollowLogic(userId: string, currentUser: UserDocument) {
    const otherUser = await this.userHelperService.findById(userId);
    const currentUserId = currentUser._id.toString();

    if (currentUserId === userId) {
      throw new BadRequestException('You cannot follow yourself');
    }
    try {
      if (!otherUser) {
        throw new NotFoundException();
      }

      if (!otherUser.followers?.includes(currentUser.id)) {
        await this.userHelperService.updateOne(currentUserId, {
          $push: {
            followings: userId,
          },
        });

        await otherUser.updateOne({
          $push: { followers: currentUser.id },
        });
        const msg = `${otherUser.id} followed`;
        return { status: 'Success', msg };
      }

      await this.userHelperService.updateOne(currentUserId, {
        $pull: {
          followings: otherUser.id,
        },
      });

      await otherUser.updateOne({
        $pull: {
          followers: currentUser.id,
        },
      });

      const msg = `${otherUser.id} unfollowed`;
      return { status: 'Success', msg };
    } catch (e) {
      console.log(e);

      return e;
    }
  }

  async updateMe(
    currentUseruser: UserDocument,
    updateFields?: UpdateFieldsDto,
    file?: Express.Multer.File,
  ) {
    if (file) {
      await this.awsService.upload(file.originalname, file.buffer);
      await this.userHelperService.updateOne(currentUseruser.id, {
        $set: {
          avatar: file.originalname,
        },
      });
    }
    await this.userHelperService.updateOne(currentUseruser.id, {
      $set: {
        ...updateFields,
      },
    });
    return { msg: 'User Updated' };
  }
}
