import express from "express";
import router from "./router/router.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/", router);

app.listen(port, () => console.log(`Server running on port ${port}`));
