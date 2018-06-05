import app from "./app";
import { PORT } from "./config";

const port = PORT || 3001;

app.listen(port, (err: any) => {
    if (err) {
        return console.log(err);
    }

    return console.log(`server is listening on ${port}`);
});
