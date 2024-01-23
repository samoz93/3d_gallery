import { Document, Model, Schema, model } from "mongoose";
import { PasswordService } from "../services/password.service";

// interface UserModel extends Model {}

export interface User {
  email: string;
  password: string;
  comparePassword: (password: string) => Promise<boolean>;
}

export interface UserDocument extends Document, User {
  id: string;
}
interface UserModel extends Model<UserDocument> {}

const schema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        ret.id = ret._id;
        delete ret._id;
      },
      versionKey: false,
    },
    // _id: false,
  }
);

schema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await PasswordService.hashPassword(this.password!);
  }
  next();
});

schema.methods.comparePassword = async function (password: string) {
  return await PasswordService.comparePassword(this.password, password);
};

export const UserModel = model<UserDocument, UserModel>("User", schema);
