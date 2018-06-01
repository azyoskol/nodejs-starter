import {
    Document
} from "mongoose";

import { IRead,IWrite } from ".";


export interface IRepository<T extends Document> extends IRead<T>, IWrite<T> {
    getName: () => string;
}