import {
  BaseRepository,
} from "../../../repository";
import { IUsers } from "../models/users";


class UsersRepository extends BaseRepository<IUsers> {
  getName(): string {
    return "Users";
  }
}