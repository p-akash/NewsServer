import mongoose from "mongoose"
import timestamps from "mongoose-timestamp"
import appConfig from "./config"

mongoose.Promise = global.Promise
mongoose.plugin(timestamps)

export const connect = (config = appConfig) => {
  mongoose.set("useCreateIndex", true)
  mongoose.connect(config.db.url,{ useNewUrlParser: true })
}

