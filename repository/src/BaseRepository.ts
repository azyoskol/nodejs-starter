import {
    IRepository,
} from "./interfaces";

import {
    Document,
    Model,
    Types,
    ModelFindOneAndUpdateOptions,
    connection,
    Error,
    QueryCursor,
    DocumentQuery,
} from "mongoose";

export enum ReadyState  {
    Disconnected = 0,
    Connected,
    Connecting,
    Disconnecting,
}

export abstract class BaseRepository<T extends Document> implements IRepository<T> {
    private _model: Model<Document>;

    constructor(schemaModel: Model<Document>) {
        this._model = schemaModel;
    }

    getName(): string {
        return "Base";
    }

    create(item: any, callback?: (error: any, result: T) => void): Promise<T> {
        let self: BaseRepository<T> = this;
        let p: Promise<T> = new Promise<T>((resolve, reject) => {
            self._model.create(item, (err: any, res:any) => {
                if (callback) {
                    callback(err, <T>res);
                }
                if (err) {
                    reject(err);
                    return;
                }

                resolve(<T>res);
            });
        });

        return p;
    }

    retrieve(callback: (error: any, result: T[]) => void): Promise<T[]> {
        let self: BaseRepository<T> = this;
        let p: Promise<T[]> = new Promise<T[]>((resolve, reject) => {
            self._model.find({}, (err, res) => {
                if (callback) {
                    callback(err, <T[]>res);
                }
                if (err) {
                    reject(err);
                    return;
                }

                resolve(<T[]>res);
            });
        });

        return p;
    }

    findById(id: string, callback?: (error: any, result: T) => void): Promise<T> {
        let self: BaseRepository<T> = this;
        let p: Promise<T> = new Promise<T>((resolve, reject) => {
            self._model.findById(id, (err, res) => {
                if (callback) {
                    callback(err, <T>res);
                }
                if (err) {
                    reject(err);
                    return;
                }

                resolve(<T>res);
            });
        });

        return p;
    }

    findOne(condition: any, fields: any, options: any, callback?: (err: any, res: T) => void): Promise<T> {
        let self: BaseRepository<T> = this;
        let p: Promise<T> = new Promise<T>((resolve, reject) => {
            self._model.findOne(condition, fields, options).exec((err, res) => {
                if (callback) {
                    callback(err, <T>res);
                }
                if (err) {
                    reject(err);
                    return;
                }

                resolve(<T>res);
            });
        });

        return p;
    }

    find(condition: any, fields: any, options: any, sortOptions?: any, callback?: (err: any, res: T[]) => void): Promise<T[]> {
        let p: Promise<T[]> = new Promise<T[]>((resolve, reject) => {
            let query: DocumentQuery<Document[], Document> = this._model.find(condition, fields, options);
            if (sortOptions) {
                query = query.sort(sortOptions);
            }

            query.exec((err, res) => {
                if (callback) {
                    callback(err, <T[]>res);
                }
                if (err) {
                    reject(err);
                    return;
                }

                resolve(<T[]>res);
            });
        });

        return p;
    }

    count(condition?: any): Promise<number> {
        let self: BaseRepository<T> = this;
        let p: Promise<number> = new Promise<number>((resolve, reject) => {
            self._model.count(condition, (err: any, count: any) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(count);
            });
        });

        return p;
    }

    save(item: T, callback?: (error: any, result: T) => void): Promise<T> {
        let p: Promise<T> = new Promise<T>((resolve, reject) => {
            item.save((err, result) => {
                if (callback) {
                    callback(err, <T>result);
                }

                if (err) {
                    reject(err);
                    return;
                }

                resolve(<T>result);
            });
            resolve(null);
        });

        return p;
    }

    upsert(condition: any, item: any, callback?: (error: any, result: T) => void): Promise<T> {
        let self: BaseRepository<T> = this;
        let p: Promise<T> = new Promise<T>((resolve, reject) => {
            let options: ModelFindOneAndUpdateOptions = {
                upsert: true
            };
            self._model.findOneAndUpdate(condition, item, options, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(<T>result);
            });
        });

        return p;
    }

    delete(_id: string, callback?: (error: any) => void): Promise<boolean> {
        let self: BaseRepository<T> = this;
        let p:Promise<boolean> = new Promise<boolean>((resolve, reject) => {
            self._model.remove({ _id: this.toObjectId(_id) }, (err) => {
                if (callback) {
                    callback(err);
                }
                if (err) {
                    reject(err);
                    return;
                }

                resolve(true);
            });
        });

        return p;
    }

    deleteAll(callback?: (error: any) => void): Promise<boolean> {
        let self: BaseRepository<T> = this;
        let p: Promise<boolean> = new Promise<boolean>((resolve, reject) => {
            self._model.remove({}, (err) => {
                if (callback) {
                    callback(err);
                }
                if (err) {
                    reject(err);
                    return;
                }
                resolve(true);
            });
        });

        return p;
    }

    deleteAllItems(items: T[], callback?: (error: any) => void): Promise<boolean> {
        let self: BaseRepository<T> = this;
        return this.forEachPromise(items, (item) => self.delete(item));
    }

    forEachPromise(items: T[], fn: (el: any)=> Promise<any>): Promise<any> {
        return items.reduce(function (promise: any, item: any): any {
            return promise.then(function (): any {
                return fn(item);
            });
        }, Promise.resolve());
    }

    processDocuments(condition: any, processor: (doc: T) => Promise<any>, note?: string): Promise<boolean> {
        let self: BaseRepository<T> = this;
        if (!condition) {
            condition = {};
        }
        let p: Promise<boolean> = new Promise<boolean>((resolve, reject) => {
          let cursor: QueryCursor<Document> = self._model.find(condition).cursor();
          cursor.on("data", (doc: T) => {
            // do something with the mongoose document
            cursor.pause();
            processor(doc).then(() => {
                cursor.resume();
            }).catch((err: Error) => {
              console.log("Error with MongoDB: " + err.message);
              console.log(self.getName());
              console.log(err);
              console.log(condition);

              if (note) {
                console.log(note);
              }

              if (connection.readyState === ReadyState.Connected) {
                cursor.resume();
                return;
              }

              reject(err);

            });
          }).on("error", (err: Error) => {
            // handle the error
            if (note) {
              console.log(note);
              return;
            }

            reject(err);
          }).on("close", () => resolve(true));      // the stream is closed
        });

        return p;
      }

    private toObjectId(_id: string): Types.ObjectId {
        return Types.ObjectId.createFromHexString(_id);
    }
}