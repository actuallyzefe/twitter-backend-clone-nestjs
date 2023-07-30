import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { User, UserDocument } from 'src/users/models/user.model';

@Injectable()
export class UserHelperService {
  constructor(@InjectModel(User.name) private readonly users: Model<User>) {}
  async findOne(filter: FilterQuery<User>): Promise<UserDocument> {
    return this.users.findOne(filter);
  }
  async findOneSelectPassword(filter) {
    return this.users.findOne(filter).select('+password');
  }

  async findById(id: string): Promise<UserDocument> {
    return this.users.findById(id);
  }

  async create(registerDto: Partial<User>): Promise<UserDocument> {
    return this.users.create(registerDto);
  }

  async updateOne(
    userId: string,
    updateFields: UpdateQuery<User>,
  ): Promise<UserDocument> {
    return this.users.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });
  }
}
