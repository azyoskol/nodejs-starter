import express from "express";

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
                message: "Hello World! and",
            });
        });
        this.express.use("/", router);
    }
}

export default new App().express;
