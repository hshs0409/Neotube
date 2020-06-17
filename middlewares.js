import routes from "./routes";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "Neotube";
  res.locals.routes = routes;
  next();
};
