
import {
  Schema,
  model,
  Document,
  Model,
} from "mongoose";
import { IUsers } from "../models";

export const usersSchema = new Schema({
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
    let doc = <IUsers>this._doc;
    let now = new Date();
    if (!doc.createdAt) {
      doc.createdAt = now;
    }
    doc.modifiedAt = now;
  }
  next();
  return this;
});

export const usersModelSchema: Model<Document> = model("user", usersSchema, "users", true);