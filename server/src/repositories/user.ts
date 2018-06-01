import {
  BaseRepository,
} from "../../../repository";
import { IUsers } from "../models/users";


export class UsersRepository extends BaseRepository<IUsers> {
  getName(): string {
    return "Users";
  }
}