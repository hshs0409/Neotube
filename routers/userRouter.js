import express from "express";
import routes from "../routes";

const userRouter = express.Router();

userRouter.get(routes.users, (res, req) => res.setEncoding("user"));
userRouter.get(routes.userDetail, (res, req) => res.setEncoding("User Detail"));
userRouter.get(routes.editProfile, (res, req) =>
  res.setEncoding("Edit Profile")
);
userRouter.get(routes.changePassword, (res, req) =>
  res.setEncoding("Change Password")
);

export default userRouter;
/*
MVC

MODEL = DATA
VIEW = HOW DOES DATA LOOK
CONTROL = FUNCTION THAT LOOKS FOR THE DATA
*/
