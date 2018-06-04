import {
  Schema,
  model,
  Document,
  Model,
} from "mongoose";
import { IUserDto } from "../models";

const usersSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  labels: {
    type: [String],
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  modifiedAt: {
    type: Date,
    required: true,
  }
}).pre("save", (next) => {
  if (this._doc) {
    const doc: any = <IUserDto>this._doc;
    const now: Date = new Date();
    if (!doc.createdAt) {
      doc.createdAt = now;
    }
    doc.modifiedAt = now;
  }
  next();
  return this;
});

export const usersModelSchema: Model<Document> = model("user", usersSchema, "users", true);