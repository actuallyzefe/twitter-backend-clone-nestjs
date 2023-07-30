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

  async followUnFollowLogic(userId: string, user2: UserDocument) {
    const otherUser = await this.userHelperService.findById(userId);
    const user2id = user2._id.toString();

    if (user2id === userId) {
      throw new BadRequestException('You cannot follow yourself');
    }
    try {
      if (!otherUser) {
        throw new NotFoundException();
      }

      if (!otherUser.followers?.includes(user2._id)) {
        await this.userHelperService.updateOne(user2id, {
          $push: {
            followings: userId,
          },
        });

        await otherUser.updateOne({
          $push: { followers: user2._id },
        });
        const msg = `${otherUser.id} followed`;
        return { status: 'Success', msg };
      }

      await this.userHelperService.updateOne(user2id, {
        $pull: {
          followings: otherUser.id,
        },
      });

      await otherUser.updateOne({
        $pull: {
          followers: user2._id,
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
