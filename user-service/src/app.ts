import { Server, loadPackageDefinition, ServerCredentials } from "grpc";
import * as protoloader from "@grpc/proto-loader";
import * as path from "path";
import { connect } from "mongoose";

const PORT:number = Number(process.env.PORT) || 3100;
const ProtoLibraryPath: string = process.env.PROTOLIBRARY || null;

if(ProtoLibraryPath === null) {
    throw new Error("Check your Proto library path");
}

const pathToUserProto: string = path.resolve(ProtoLibraryPath) + "/user.proto";
const { userService } = loadPackageDefinition(protoloader.loadSync(pathToUserProto, {}));

export class App {
    private server: Server;

    constructor() {
        this.initServer();
        this.initDB();
    }

    static start(): App {
       return new App();
    }

    private initServer(): void {
        this.server = new Server();

        this.server.addService(userService.users.UsersService.service, {
            // todo: add more methods
            get(call: any, callback: any): any {
                const payload: any = {
                    id: 1
                };
                callback(payload);
            }
        });
        this.server.bind("any ip", ServerCredentials.createInsecure());
        this.server.start();
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