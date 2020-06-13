import "core-js";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";
const app = express();

// respond with "hello world" when a GET request is made to the homepage'
//request object =req
//response object = res

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));

app.use("/", globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;
