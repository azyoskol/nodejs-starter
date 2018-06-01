export interface IRead<T> {
    find(item: T): Promise<T[]>;
    first(id: string): Promise<T>;
}