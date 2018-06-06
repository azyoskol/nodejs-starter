import express from "express";
import { load, credentials } from "grpc";
import path from "path";

const helloWorldService = load(path.resolve(__dirname, "../../proto/helloworld.proto")).helloworld;

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
      this.client.SayHello({ name: "World" }, (message: any) => {
        res.json({
          message: message.details,
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
