import "@babel/polyfill";
import "core-js";
import "./db";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();
import "./models/Video";
import "./models/Comment";

const PORT = process.env.PORT || 4000;

const handleListening = () =>
  console.log(`✅ Listening on : http://localhost:${PORT}`);
// const handleListening = () => {};

app.listen(PORT, handleListening);
