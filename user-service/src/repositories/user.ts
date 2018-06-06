import {
  BaseRepository,
} from "repository";
import {IUserDto} from "../models";


export class UserRepository extends BaseRepository<IUserDto> {
  getName(): string {
    return "User";
  }
}