import axios from "axios";

const axiosInstance = axios.create({
  baseURL: ""
});

export class ApiService {
  static async getData(url, headers, cancelToken, data) {
    const config = {
      headers: {
        ...(headers || {}),
        "Content-Type": "application/json"
      }
    };
    if (data) {
      config.data = data;
    }
    if (cancelToken && cancelToken.token) {
      config.cancelToken = cancelToken.token;
    }
    const response = await axiosInstance.get(url, config).catch(err => {
      data = { error: "something went wrong" };
    });
    return data || response.data;
  }

  static async getAllNews(qs) {
    return await ApiService.getData(
      `https://inshorts.com/api/en/news?${qs}&max_limit=1000`
    );
  }
  static async getByType(qs) {
    return await ApiService.getData(
      `https://inshorts.com/api/en/search/trending_topics/${qs}`
    );
  }

  static async getInsTopic() {
    return await ApiService.getData(
      `https://inshorts.com/api/en/search/trending_topics`
    );
  }

  static async getBBCNews() {
    return await ApiService.getData(
      "https://newsapi.org/v2/top-headlines?apiKey=d83d2124829a4f13a9a24ee011e7c467&pageSize=100"
    );
  }

  static async getBBCNewsCategory() {
    return await ApiService.getData(
      "https://newsapi.org/v2/top-headlines?apiKey=d83d2124829a4f13a9a24ee011e7c467&category=business&pageSize=100"
    );
  }
}
