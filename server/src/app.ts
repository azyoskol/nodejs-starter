import express from "express";
import {
  connect
} from "mongoose";
class App {
    public express: any;

    constructor() {
        this.express = express();
        this.mountRoutes();
    }

    private mountRoutes(): void {
        const router = express.Router();
        router.get("/", (req, res) => {
            res.json({
                message: "Hello World!",
            });
        });
        this.express.use("/", router);
    }

    private initDataBase(): void {
      let uri = "mongodb://localhost/heroes";
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

export default new App().express;
