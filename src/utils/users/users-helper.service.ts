import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { User, UserDocument } from 'src/users/models/user.model';

@Injectable()
export class UserHelperService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async findOne(filter: FilterQuery<User>): Promise<UserDocument> {
    return this.userModel.findOne(filter);
  }
  async findOneSelectPassword(filter: FilterQuery<User>) {
    return this.userModel.findOne(filter).select('+password');
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async findAll() {
    return this.userModel.find();
  }

  async create(registerDto: Partial<User>): Promise<UserDocument> {
    return this.userModel.create(registerDto);
  }

  async updateOne(
    userId: string,
    updateFields: UpdateQuery<User>,
  ): Promise<UserDocument> {
    return this.userModel.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });
  }
}
