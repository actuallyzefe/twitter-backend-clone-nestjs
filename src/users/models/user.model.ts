import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export enum Roles {
  user = 'user',
  admin = 'admin',
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
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
  followers: mongoose.Schema.Types.ObjectId[];

  @Prop({ ref: 'User', default: [] })
  followings: mongoose.Schema.Types.ObjectId[];

  @Prop({ default: [] })
  tweets: mongoose.Schema.Types.ObjectId[];

  @Prop({ type: Boolean, required: true })
  status: Boolean;

  @Prop({ type: Number })
  verifyCode: number;

  @Prop({ type: Date })
  verifyCodeExpiresAt: Date;

  @Prop({ type: Number })
  passwordVerifyCode: number;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
