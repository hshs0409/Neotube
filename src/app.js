import "core-js";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import mongoose from "mongoose";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import routes from "./routes";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";
import apiRouter from "./routers/apiRotuer";

import "./passport";

const app = express();

const CokieStore = MongoStore(session);

// respond with "hello world" when a GET request is made to the homepage'
//request object =req
//response object = res

app.use(helmet()); // 보안 강화
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use("/static", express.static(path.join(__dirname, "static")));
app.use(cookieParser()); //  쿠키를 이용하여 사용자의 인증 정보같은것들 저장
app.use(bodyParser.json()); // 웹사이트로 전달하는 정보들 검사 form 이나 json같은 형태로 된 body
app.use(bodyParser.urlencoded({ extended: true })); // url 인코더
app.use(morgan("dev")); //  모든 작업 log (기록)
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new CokieStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(localsMiddleware);

app.use("/", globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);

export default app;

/*
MVC

MODEL = DATA
VIEW = HOW DOES DATA LOOK  -> pug
CONTROL = FUNCTION THAT LOOKS FOR THE DATA
라우터들

set함수는 name 과 value가 필요
*/

/*

*/
