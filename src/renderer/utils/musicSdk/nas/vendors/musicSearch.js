import { formatPlayTime, sizeFormate } from "../../../index";
import api from "./api";

export default {
  limit: 50,
  total: 0,
  page: 0,
  allPage: 1,
  successCode: 0,

  // 根据关键字搜索音乐
  search(str, page = 1, limit) {
    if (limit == null) limit = this.limit;
    return this.musicSearch(str, page, limit).then((res) => {
      let list = this.handleResult(res.searchResult3);

      this.total = 100;
      this.page = page;
      this.allPage = Math.ceil(this.total / limit);

      return Promise.resolve({
        list,
        allPage: this.allPage,
        limit,
        total: this.total,
        source: "nas",
      });
    });
  },
  musicSearch(str, page, limit, retryNum = 0) {
    if (retryNum > 5) return Promise.reject(new Error("搜索失败"));
    return api.searchSong(str, limit, page).promise;
  },
  handleResult(rawList) {
    const list = [];
    rawList.forEach((item) => {
      /* {
        "id": "a61230eb90558f1f594cfc3d2acece70",
        "parent": "5605ab9f7f0fd78df5f1c6f98de8c43b",
        "isDir": false,
        "title": "离去之原",
        "album": "最新热歌慢摇87",
        "artist": "茶理理",
        "coverArt": "mf-a61230eb90558f1f594cfc3d2acece70_65753954",
        "size": 16190817,
        "contentType": "audio/mpeg",
        "suffix": "mp3",
        "duration": 273,
        "bitRate": 320,
        "path": "茶理理/最新热歌慢摇87/离去之原.mp3",
        "created": "2023-12-10T04:06:55.030192487Z",
        "albumId": "5605ab9f7f0fd78df5f1c6f98de8c43b",
        "artistId": "059c1ae772e023998271c3e961672c98",
        "type": "music",
        "isVideo": false,
        "bpm": 0,
        "comment": "",
        "sortName": "",
        "mediaType": "song",
        "musicBrainzId": "",
        "genres": [],
        "replayGain": {
          "trackPeak": 1,
          "albumPeak": 1
        },
        "channelCount": 2,
        "samplingRate": 44100
      } */
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
      list.push(JSON.parse(JSON.stringify(entry)));
    });
    return list;
  },
};
