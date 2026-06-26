import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import notFound from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/", router);

app.use(notFound);

app.use(errorHandler);

export default app;