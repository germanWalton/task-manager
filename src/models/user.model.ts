import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../interfaces/user.interface";

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser & Document>("User", UserSchema);
