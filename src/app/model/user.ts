import mongoose, { Document, Schema, models } from "mongoose";

export interface User extends Document {
  email: string;
  password: string;
}

const UserSchema: Schema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

const User = models.User || mongoose.model<User>("User", UserSchema);

export default User;
