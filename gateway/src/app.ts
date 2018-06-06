import express from "express";
import { load, credentials } from "grpc";

const helloWorldService = load(__dirname + "../../proto/helloworld.proto").helloworld;

class App {
  public express: any;

  private client: any;

  constructor() {
    this.express = express();
    this.initClient();
    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router();
    router.get("/", async (req, res) => {
      this.client.SayHello({ message: "World" }, (message: any) => {
        res.json({
          message: "Hello World!",
        });
      });
    });
    this.express.use("/", router);
  }

  private initClient() {
    this.client = new helloWorldService.Greeter("0.0.0.0:50051", credentials.createInsecure());
  }
}

export default new App().express;
