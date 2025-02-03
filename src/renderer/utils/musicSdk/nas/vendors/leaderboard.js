export default {
  limit: 300,
  list: [],
  async getBoards(retryNum = 0) {
    return {
      list: [],
      source: "nas",
    };
  },
  getList(bangid, page, retryNum = 0) {
    return Promise.resolve({
      total: 0,
      list: [],
      limit: this.limit,
      page: 1,
      source: "nas",
    });
  },
  getDetailPageUrl(id) {
    if (typeof id == "string") id = id.replace("tx__", "");
    return `https://y.qq.com/n/ryqq/toplist/${id}`;
  },
};
