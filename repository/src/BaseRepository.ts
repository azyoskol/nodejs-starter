import {
    IRead,
    IWrite,
} from "./interfaces";

export abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {

    find(item: T): Promise<T[]> {
        throw new Error("Method not implemented.");
    }
    first(id: string): Promise<T> {
        throw new Error("Method not implemented.");
    }

    // we add to method the async keyword to manipulate the insert result of method.
    async create(item: T): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    update(id: string, item: T): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}