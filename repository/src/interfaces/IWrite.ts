import {
    Document
} from "mongoose";

export interface IWrite<T extends Document> {
    create: (item: any, callback?: (error: any, result: T) => void) => Promise<T>;
    save: (item: T, callback?: (error: any, result: T) => void) => Promise<T>;
    upsert: (condition: any, item: T, callback?: (error: any, result: T) => void) => Promise<T>;
    delete: (_id: string, callback?: (error: any) => void) => Promise<boolean>;
    deleteAll: (callback?: (error: any) => void) => Promise<boolean>;
    deleteAllItems: (items: T[], callback?: (error: any) => void) => Promise<boolean>;
}