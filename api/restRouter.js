import express from "express"

import {usersRouter} from "./users"
import {newsRouter} from "./news"

export const restRouter = express.Router()


// The authorization routes go here Api Routs
restRouter.use("/users", usersRouter)
restRouter.use("/news", newsRouter)
