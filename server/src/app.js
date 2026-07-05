import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import notFound from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());
app.use(
    cors({
        origin: ["https://hoppscotch.io", "http://localhost:5173", "https://jira-cpm.vercel.app"],
        credentials: true,
    })
);  
app.use(express.json());

// routes
app.use("/", router);

app.use(notFound);

app.use(errorHandler);

export default app;