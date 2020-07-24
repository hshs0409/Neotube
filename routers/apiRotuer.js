import express from "express";
import {
  postRegisterView,
  postAddComment,
  postDeleteComment,
} from "../controllers/videoController";
import { postAddLike } from "../controllers/userController";
import routes from "../routes";

const apiRouter = express.Router();

apiRouter.post(routes.registerView, postRegisterView);
apiRouter.post(routes.addComment, postAddComment);
apiRouter.post(routes.deleteComment, postDeleteComment);
apiRouter.post(routes.addLike, postAddLike);

export default apiRouter;
