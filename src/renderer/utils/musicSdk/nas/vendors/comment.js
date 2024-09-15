export default {
  async getComment(mInfo, page = 1, limit = 20) {
    return {
      source: 'nas',
      comments: [],
      total: 0,
      page,
      limit,
      maxPage: 1,
    }
  },
  async getHotComment(mInfo, page = 1, limit = 20) {
    return {
      source: 'nas',
      comments: [],
      total: 0,
      page,
      limit,
      maxPage: 1,
    }
  },
}
