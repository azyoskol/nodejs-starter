import express from "express";
import { load, credentials } from "grpc";
import path from "path";

const helloWorldService: any = load(path.resolve(__dirname, "../../proto/helloworld.proto")).helloworld;
const USER_SERVICE_HOST = process.env.USER_SERVICE_HOSTNAME || "0.0.0.0";

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
    this.client = new helloWorldService.Greeter(`${USER_SERVICE_HOST}:50051`, credentials.createInsecure());
  }
}

export default new App().express;
