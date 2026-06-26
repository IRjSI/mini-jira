import express from "express";
import cors from "cors";
import router from "./src/routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/", router);

export default app;