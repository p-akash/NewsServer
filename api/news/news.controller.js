import { generateControllers } from "../../modules/query";
import { News } from "./news.modal";
import seedData from "../helpers/seedData";

const syncInsTranding = async (req, res) => {
  const resInsTranding = await seedData.syncInsTranding(req.body.topic);
  res.status(200).send(resInsTranding);
};
export default generateControllers(News, {
  syncInsTranding
});

// import { ApiService } from "../helpers/helper";
// import NewsAPI from "newsapi";
// import Twitter from "twitter";

// const newsapi = new NewsAPI("d83d2124829a4f13a9a24ee011e7c467");

// const client = new Twitter({
//   consumer_key: "WB1ybTYfZeBqIJRpUBvzKwu5t",
//   consumer_secret: "DQ0X08zLG5uoX5rpaPJZe0e1hlVYZPO6MQM1rJNMuXFsYZPNE4",
//   access_token_key: "4015965845-sQbZc2ysVTSGoUd4fm0aahOwqwfkURIQ8G1eboP",
//   access_token_secret: "u8RlVmoTKJBjPjGejNJDQeqeUrgQZ5Nlo2HbUCm1ALgIo"
// });

// const parseQs = (newsList, type, subtype) => {
//   const data = newsList.map(x => ({
//     content: x.news_obj.content,
//     title: x.news_obj.title,
//     imageUrl: x.news_obj.image_url,
//     sourceUrl: x.news_obj.source_url,
//     videoUrl: "",
//     type: type,
//     newsId: x.hash_id,
//     subtype: subtype
//   }));
//   return data;
// };

// const parseTW = (newsList, type, subtype) => {
//   const data = newsList.map(x => ({
//     content: x && x.extended_tweet && x.extended_tweet.full_text,
//     title: x.text,
//     imageUrl:
//       x &&
//       x.extended_tweet &&
//       x.extended_tweet.extended_entities &&
//       x.extended_tweet.extended_entities.media[0] &&
//       x.extended_tweet.extended_entities.media[0].media_url_https,
//     videoUrl: "",
//     sourceUrl:
//       x &&
//       x.extended_tweet &&
//       x.extended_tweet.extended_entities &&
//       x.extended_tweet.extended_entities.media[0] &&
//       x.extended_tweet.extended_entities.media[0].expanded_url,
//     type: type,
//     subtype: subtype,
//     newsId: x.id
//   }));
//   return data;
// };

// const postNews = async (req, res) => {
//   const { qs, type, subtype } = req.body;
//   try {
//     if (type === "ins") {
//       if (subtype === "top_stories" || subtype === "all_news") {
//         /* const info = await ApiService.getAllNews(qs);
//         await News.remove({})
//         const response = parseQs(info && info.data && info.data.news_list, type, subtype);
//         await News.create(response)
//         const data = await News.find({})
//         res.status(200).send({ message: "success", data })*/
//         // const data = SeedData.syncIns(req)
//         const response = await News.find({});
//         console.log("data====seed==========>");
//         res.status(200).send({ message: "success", response });
//       } else {
//         const info = await ApiService.getByType(qs);
//         const response = parseQs(info.data.news_list);
//         res.status(200).send({ message: "success", response });
//       }
//     } else if (type === "tw") {
//       client.get(
//         `https://api.twitter.com/1.1/tweets/search/30day/devsearch.json?query=%23${qs}`,
//         async (error, tweets, response) => {
//           if (error) console.log(error);
//           await News.remove({});
//           const newresponse = parseTW(tweets.results, type, subtype);
//           await News.create(newresponse);
//           const data = await News.find({});
//           res.status(200).send({ message: "success", newresponse });
//         }
//       );
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(422).send({ success: false, message: err.message });
//   }
// };
