import "core-js";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { localsMiddleware } from "./middlewares";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";

const app = express();

// respond with "hello world" when a GET request is made to the homepage'
//request object =req
//response object = res

app.use(helmet()); // 보안 강화
app.set("view engine", "pug");
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));
app.use(cookieParser()); //  쿠키를 이용하여 사용자의 인증 정보같은것들 저장
app.use(bodyParser.json()); // 웹사이트로 전달하는 정보들 검사 form 이나 json같은 형태로 된 body
app.use(bodyParser.urlencoded({ extended: true })); // url 인코더
app.use(morgan("dev")); //  모든 작업 log (기록)
app.use(localsMiddleware);

app.use("/", globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);

export default app;

/*
MVC

MODEL = DATA
VIEW = HOW DOES DATA LOOK  -> pug
CONTROL = FUNCTION THAT LOOKS FOR THE DATA
라우터들

set함수는 name 과 value가 필요
*/
