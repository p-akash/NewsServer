import { generateControllers } from "../../modules/query.js";
import { News } from "../news/news.modal";
import { ApiService } from "./helper";
import Twitter from "twitter";

const client = new Twitter({
  consumer_key: "WB1ybTYfZeBqIJRpUBvzKwu5t",
  consumer_secret: "DQ0X08zLG5uoX5rpaPJZe0e1hlVYZPO6MQM1rJNMuXFsYZPNE4",
  access_token_key: "4015965845-sQbZc2ysVTSGoUd4fm0aahOwqwfkURIQ8G1eboP",
  access_token_secret: "u8RlVmoTKJBjPjGejNJDQeqeUrgQZ5Nlo2HbUCm1ALgIo"
});

const parseQs = (newsList, type, subtype) => {
  const data = newsList.map(x => ({
    content: x.news_obj.content,
    title: x.news_obj.title,
    imageUrl: x.news_obj.image_url,
    sourceUrl: x.news_obj.source_url,
    videoUrl: "",
    type: type,
    newsId: x.hash_id,
    subtype: subtype
  }));
  return data;
};
const parseTW = (newsList, type, subtype) => {
  const data = newsList.map(x => ({
    content: x && x.extended_tweet && x.extended_tweet.full_text,
    title: x.text,
    imageUrl:
      x &&
      x.extended_tweet &&
      x.extended_tweet.extended_entities &&
      x.extended_tweet.extended_entities.media[0] &&
      x.extended_tweet.extended_entities.media[0].media_url_https,
    videoUrl: "",
    sourceUrl:
      x &&
      x.extended_tweet &&
      x.extended_tweet.extended_entities &&
      x.extended_tweet.extended_entities.media[0] &&
      x.extended_tweet.extended_entities.media[0].expanded_url,
    type: type,
    subtype: subtype,
    newsId: x.id
  }));
  return data;
};
//upsert inshorts data
const syncIns = async () => {
  const { qs, type, subtype } = {
    qs: "category=top_stories&include_card_data=true",
    type: "ins",
    subtype: "top_stories"
  };
  try {
    if (type === "ins") {
      const info = await ApiService.getAllNews(qs);
      const response = parseQs(
        info && info.data && info.data.news_list,
        type,
        subtype
      );
      response.forEach(async d => {
        await News.update({ newsId: d.newsId }, { $set: d }, { upsert: true });
      });
      //News.create(response);

      return { message: "success" };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: err.message };
  }
};
//upsert twitter data
const syncTW = async () => {
  const { qs, type, subtype } = {
    qs: "usnews",
    type: "tw",
    subtype: "hashtag"
  };
  try {
    client.get(
      `https://api.twitter.com/1.1/tweets/search/30day/devsearch.json?query=%23${qs}`,
      async (error, tweets, response) => {
        if (error) console.log(error);

        const newresponse = parseTW(tweets.results, type, subtype);
        //await News.create(newresponse);
        newresponse.forEach(async d => {
          await News.update(
            { newsId: d.newsId },
            { $set: d },
            { upsert: true }
          );
        });
      }
    );
    return { message: "success" };
  } catch (err) {
    console.log(err);
    return { success: false, message: err.message };
  }
};
//clear all data
const clearData = async () => {
  return News.remove({});
};
export default generateControllers(News, {
  syncIns,
  syncTW,
  clearData
});
