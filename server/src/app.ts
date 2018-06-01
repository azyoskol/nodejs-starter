import express from "express";
import {
  connect
} from "mongoose";

import {
  UsersRepository
} from "./repositories";
import {
 usersModelSchema
} from "./schemas";
class App {
    public express: any;

    constructor() {
        this.express = express();
        this.mountRoutes();
        this.initDataBase();
    }

    private mountRoutes(): void {
        const router = express.Router();
        router.get("/", async (req, res) => {
            const userRepository = new UsersRepository(usersModelSchema);
            const userCount = await userRepository.count();
            res.json({
                message: "Hello World! user count:" + userCount,
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
