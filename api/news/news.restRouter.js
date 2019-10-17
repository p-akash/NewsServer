import express from "express";
import newsController from "./news.controller";

export const newsRouter = express.Router();

newsRouter
  .route("/")
  .get(newsController.getAll)
  .post(newsController.postNews);


