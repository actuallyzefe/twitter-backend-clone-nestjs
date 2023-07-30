import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/models/user.model';
import { UserHelperService } from './users-helper.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [UserHelperService],
  exports: [UserHelperService],
})
export class UserhelperModule {}
