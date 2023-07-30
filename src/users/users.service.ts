import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserHelperService } from 'src/utils/users-helper.service';
import { UserDocument } from './models/user.model';

@Injectable()
export class UsersService {
  constructor(private userHelperService: UserHelperService) {}

  async getMe(user: UserDocument) {
    return user;
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

      if (!otherUser.followers?.includes(currentUser._id)) {
        await this.userHelperService.updateOne(currentUserId, {
          $push: {
            followings: userId,
          },
        });

        await otherUser.updateOne({
          $push: { followers: currentUser._id },
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
          followers: currentUser._id,
        },
      });

      const msg = `${otherUser.id} unfollowed`;
      return { status: 'Success', msg };
    } catch (e) {
      console.log(e);

      return e;
    }
  }
}
