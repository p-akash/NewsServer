import mongoose, { Schema } from "mongoose";
import timestamps from "mongoose-timestamp";

const newsSchema = Schema({
  title: String,
  sourceUrl: String,
  imageUrl: String,
  content: String,
  videoUrl: String,
  type: String,
  newsId: String,
  subtype: String
}).plugin(timestamps);

export const News = mongoose.model("news", newsSchema);
