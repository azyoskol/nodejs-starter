import { Server, ServerCredentials, load } from "grpc";
// import { connect } from "mongoose";
import path from "path";

const helloWorldService: any = load(path.resolve(__dirname, "../../../../proto/helloworld.proto")).helloworld;

export class App {
    private server: Server;
    private helloWorldService: any;
    constructor() {
        this.helloWorldService = helloWorldService;
        this.initServer();
        // this.initDB();
    }

    static start(): App {
        return new App();
    }

    private initServer(): void {
        this.server = new Server();
        this.server.addProtoService(this.helloWorldService.Greeter.service, {
            SayHello: (call: any, callback: any) => {
                console.log(call);
                callback({ message: "Hello " + call.request.name });
            }
        });

        this.server.bind("0.0.0.0:50051", ServerCredentials.createInsecure());
        this.server.start();
    }

    // private initDB(): void {
    //     const uri: string = "mongodb://localhost/user"; // todo: move to config
    //     connect(uri, (err) => {
    //         if (err) {
    //             console.log(err.message);
    //             console.log(err);
    //             return;
    //         }
    //         console.log("Connected to MongoDb");
    //     });
    // }
}