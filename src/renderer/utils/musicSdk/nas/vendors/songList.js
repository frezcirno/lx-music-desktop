import {
  formatPlayTime,
  sizeFormate,
  dateFormat,
  formatPlayCount,
} from "../../../index";
import api from "./api";

export default {
  _requestObj_list: null,
  limit_list: 36,
  limit_song: 100000,
  sortList: [
    {
      name: "最热",
      id: "1",
    },
    {
      name: "最新",
      id: "0",
    },
  ],

  // 根据Tag获取推荐歌单
  getList(sortId, tagId, page, tryNum = 0) {
    if (tryNum > 5) throw new Error("max retry");
    return api.getPlaylists().promise.then((res) => {
      if (res.status != "ok")
        return this.getList(sortId, tagId, page, ++tryNum);
      return {
        list: res.playlists.playlist.map((item) => {
          // {
          //   "id": "7c972191-bc52-4828-b0e8-cdb48dbdcc98",
          //   "name": "Like",
          //   "songCount": 28,
          //   "duration": 6501,
          //   "public": true,
          //   "owner": "admin",
          //   "created": "2023-12-10T03:33:24.180898732Z",
          //   "changed": "2024-09-07T04:43:03.685626365Z",
          //   "coverArt": "pl-7c972191-bc52-4828-b0e8-cdb48dbdcc98_66dbd9d7"
          // }
          return {
            play_count: formatPlayCount(item.listennum),
            id: item.id,
            author: item.owner,
            name: item.name,
            time: dateFormat(item.created, "Y-M-D"),
            img: api.getCoverArtURL(item.id),
            // grade: item.favorcnt / 10,
            total: item.songCount,
            desc: "",
            source: "nas",
          };
        }),
        limit: this.limit_list,
        total: 100,
        source: "nas",
      };
    });
  },

  // 获取歌曲列表内的音乐
  async getListDetail(id, tryNum = 0) {
    if (tryNum > 2) return Promise.reject(new Error("try max num"));

    const requestObj_listDetail = api.getPlaylist(id);
    const res = await requestObj_listDetail.promise;
    console.log(res);

    if (res.status != "ok") return this.getListDetail(id, ++tryNum);
    const cdlist = res.playlist;
    return {
      list: this.filterListDetail(cdlist.entry),
      page: 1,
      limit: cdlist.songCount + 1,
      total: cdlist.songCount,
      source: "nas",
      info: {
        name: cdlist.name,
        img: api.getCoverArtURL(cdlist.id),
        desc: "",
        author: cdlist.owner,
        play_count: formatPlayCount(9999),
      },
    };
  },
  filterListDetail(rawList) {
    return rawList.map((item) => {
      let types = [];
      let _types = {};
      let bitRate = `${item.bitRate}k`;
      let size = sizeFormate(item.size);
      types.push({ type: bitRate, size });
      _types[bitRate] = { size };
      let entry = {
        singer: item.artist,
        name: item.title,
        albumName: item.album,
        albumId: item.albumId,
        source: "nas",
        interval: formatPlayTime(item.duration),
        songId: item.id,
        albumMid: item.albumId,
        strMediaMid: item.id,
        songmid: item.id,
        img:
          item.albumId === ""
            ? item.artist
              ? api.getCoverArtURL(item.artistId)
              : ""
            : api.getCoverArtURL(item.id),
        types,
        _types,
        typeUrl: {},
      };
      return JSON.parse(JSON.stringify(entry));
    });
  },

  // 获取热门标签列表
  getTags() {
    return Promise.resolve({
      hotTag: [],
      tags: [],
      source: "nas",
    });
  },

  // 获取歌单详情页链接
  async getDetailPageUrl(id) {
    return api.getPlaylistURL(id);
  },

  // 根据关键词搜索歌单
  search(text, page, limit = 20, retryNum = 0) {
    if (retryNum > 5) throw new Error("max retry");
    return api.getPlaylists().promise.then((res) => {
      if (res.status != "ok") return this.search(text, page, limit, ++retryNum);
      return {
        list: res.playlists.playlist.map((item) => {
          // {
          //   "id": "7c972191-bc52-4828-b0e8-cdb48dbdcc98",
          //   "name": "Like",
          //   "songCount": 28,
          //   "duration": 6501,
          //   "public": true,
          //   "owner": "admin",
          //   "created": "2023-12-10T03:33:24.180898732Z",
          //   "changed": "2024-09-07T04:43:03.685626365Z",
          //   "coverArt": "pl-7c972191-bc52-4828-b0e8-cdb48dbdcc98_66dbd9d7"
          // }
          return {
            play_count: formatPlayCount(item.listennum),
            id: item.id,
            author: item.owner,
            name: item.name,
            time: dateFormat(item.created, "Y-M-D"),
            img: api.getCoverArtURL(item.id),
            // grade: item.favorcnt / 10,
            total: item.songCount,
            desc: "",
            source: "nas",
          };
        }),
        limit,
        total: 100,
        source: "nas",
      };
    });
  },
};

// getList
// getTags
// getListDetail
