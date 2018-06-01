import {
    Document
} from "mongoose";

export interface IRead<T extends Document> {
    processDocuments: (condition: any, processor: (doc: T) => Promise<any>, note?: string) => Promise<boolean>;
    retrieve: (callback?: (error: any, result: T[]) => void) => Promise<T[]>;
    findById: (id: string, callback?: (error: any, result: T) => void) => Promise<T>;
    findOne: (condition: any, fields: any, options: any, callback?: (err: any, res: T) => void) => Promise<T>;
    find: (condition: any, fields: any, options: any, sortOptions?: any,
      callback?: (err: any, res: T[]) => void) => Promise<T[]>;
    count: (condition?: any) => Promise<number>;
}