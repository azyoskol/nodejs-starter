import { IUser } from "../../../models";
import {
  Document
} from "mongoose";

export interface IUserDto extends IUser, Document {
}