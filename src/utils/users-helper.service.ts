import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from 'src/users/models/user.model';

@Injectable()
export class UserHelperService {
  constructor(@InjectModel(User.name) private readonly users: Model<User>) {}
  async findOne(filter: FilterQuery<User>): Promise<UserDocument> {
    return this.users.findOne(filter);
  }

  async create(registerDto: Partial<User>): Promise<UserDocument> {
    return this.users.create(registerDto);
  }
}
