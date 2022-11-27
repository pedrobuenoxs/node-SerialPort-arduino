import { server } from "./app/config/app.js";
import * as dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
