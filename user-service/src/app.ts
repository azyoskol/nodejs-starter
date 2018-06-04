import * as grpc from "grpc";
import * as protoloader from "@grpc/proto-loader";
import * as path from "path";
import { connect } from "mongoose";

const PORT:number = Number(process.env.PORT) || 3100;
const ProtoLibraryPath: string = process.env.PROTOLIBRARY || null;

if(ProtoLibraryPath === null) {
    throw new Error("Check your Proto library path");
}

const pathToUserProto: string = path.resolve(ProtoLibraryPath) + "/user.proto";
const { user: any } = grpc.loadPackageDefinition(protoloader.loadSync(pathToUserProto, {}));

export class App {
    constructor() {
        this.initDB();
    }

    private initDB(): void {
        const uri: string = "mongodb://localhost/user"; // todo: move to config
        connect(uri, (err) => {
          if (err) {
            console.log(err.message);
            console.log(err);
            return;
          }
          console.log("Connected to MongoDb");
        });
    }
}