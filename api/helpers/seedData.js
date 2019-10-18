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
//upsert inshorts top_stories data
const syncIns = async subtype => {
  // const { qs, type, subtype } = {
  //   qs: "category=top_stories&include_card_data=true",
  //   type: "ins",
  //   subtype: "top_stories"
  // };
  const qs = "category=top_stories&include_card_data=true";
  const type = "ins";
  try {
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
  } catch (err) {
    console.log(err);
    return { success: false, message: err.message };
  }
};

//upsert inshorts trending topic wise data
const syncInsTranding = async subtype => {
  // const { qs, type, subtype } = {
  //   qs: "category=top_stories&include_card_data=true",
  //   type: "ins",
  //   subtype: "top_stories"
  // };
  const type = "ins";
  try {
    const info = await ApiService.getByType(subtype);
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
  } catch (err) {
    console.log(err);
    return { success: false, message: err.message };
  }
};

//upsert twitter data
const syncTW = async (qs, subtype) => {
  // const { qs, type, subtype } = {
  //   qs: "usnews",
  //   type: "tw",
  //   subtype: "hashtag"
  // };
  const type = "tw";
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

//clear exceed data
const clearExceedData = async () => {
  try {
    const subType = await News.distinct("subtype");
    subType.map(async d => {
      const count = await News.find({ subtype: d }).count();
      if (count > 200) {
        const c = count - 200;
        const id = await News.aggregate()
          .match({ subtype: d })
          .project({ _id: 1 })
          .sort({ createdAt: 1 })
          .limit(c);
        const idArray = id.map(a => a._id);
        await News.remove({ _id: { $in: idArray } });
      }
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: error };
  }
};

export default generateControllers(News, {
  syncIns,
  syncTW,
  clearData,
  clearExceedData,
  syncInsTranding
});
