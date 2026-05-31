import bcrypt from "bcryptjs";
import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email?: string;
  password?: string;
  walletAddress?: string;
  role: "artisan" | "buyer" | "admin";
  profileImage?: string;
  bio?: string;
  village?: string;
  district?: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    walletAddress: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    role: {
      type: String,
      enum: ["artisan", "buyer", "admin"],
      default: "buyer"
    },
    profileImage: String,
    bio: String,
    village: String,
    district: String
  },
  { timestamps: true }
);

UserSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = function comparePassword(candidate: string) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
