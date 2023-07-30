import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, ObjectId, Types } from 'mongoose';

export enum Roles {
  user = 'user',
  admin = 'admin',
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop()
  name: string;

  @Prop({ unique: [true, 'This nickname is taken '] })
  nickname: string;

  @Prop({ unique: [true, 'This email is taken'] })
  email: string;

  @Prop({ default: 'user' })
  role: Roles;

  @Prop({ select: false })
  password: string;

  @Prop({ default: 'default.jpg' })
  avatar: string;

  @Prop({ default: '', max: 150 })
  bio: string;

  @Prop({ ref: 'User', default: [] })
  followers: Types.ObjectId[];

  @Prop({ ref: 'User', default: [] })
  followings: Types.ObjectId[];
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
