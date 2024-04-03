import { app } from "./app.js";
import connectDB from "./src/db/connection.js";

const port = 3000;
const dbUrl = "mongodb://127.0.1.:27017/";

const connectServer = async () => {
  app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
  });
};

connectDB(dbUrl)
  .then(() => {
    connectServer();
  })
  .catch((err) => {
    console.log("Failed in connecting to db");
  });
