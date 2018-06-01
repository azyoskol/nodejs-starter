import {
  Document
} from "mongoose";

export interface IUsers extends Document {
  name: string;
  userName: string;
  gender: string;
  labels: string[];
  createdAt: Date;
  modifiedAt: Date;
}
