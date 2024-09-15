import musicSearch from "./musicSearch";
import songList from "./songList";
import leaderboard from "./leaderboard";
import hotSearch from "./hotSearch";
import comment from "./comment";
import api from "./api";

const nas = {
  leaderboard,
  songList,
  musicSearch,
  hotSearch,
  comment,

  // 获取音乐播放链接
  getMusicUrl(songInfo, type) {
    return {
      promise: Promise.resolve({
        type,
        url: api.getDownloadURL(songInfo.songmid).toString(),
      }),
    };
  },

  // 获取歌词
  getLyric(songInfo) {
    return {
      promise: Promise.reject(new Error("fail")),
    };
  },

  // 获取音乐封面
  getPic(songInfo) {
    return api.getCoverArtURL(songInfo.songId);
  },

  // 获取音乐详情页链接
  getMusicDetailPageUrl(songInfo) {
    return api.getAlbumURL(songInfo.albumId);
  },
};

export default nas;
