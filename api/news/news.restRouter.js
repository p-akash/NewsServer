import express from "express";
import newsController from "./news.controller";

export const newsRouter = express.Router();

newsRouter.route("/").get(newsController.getAll);

newsRouter.route("/tranding-topic").post(newsController.syncInsTranding);
newsRouter.route("/tranding-topic").delete(newsController.deleteByTopic);
