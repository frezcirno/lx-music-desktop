import { httpFetch } from "../../../request";
import { toMD5 } from "../../utils";

const r47 = (str) => {
  return str
    .split("")
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code >= 33 && code <= 126) {
        return String.fromCharCode(33 + ((code + 14) % 94));
      }
      return char;
    })
    .join("");
};

// subsonic api
const SubSonicFetch = {
  serverAPIVersion: "1.16.0",
  largerThan113: true,
  _u: Buffer.from(r47("*(#E2(cl"), r47("32D6ec")).toString(),
  _p: Buffer.from(r47("*(#E2(cl"), r47("32D6ec")).toString(),
  _s: Buffer.from(r47("2w#_4w|e{Jh>4?pE3>hb{?#G4s@I|K8_}JhE3)'K2(|l"), r47("32D6ec")).toString(),
  _ts: "",
  _tt: "",
  _b: "0",
  // coverArtCache: {},
  _buildURI(method, params, traditional) {
    // 构建基础 URI
    var uri = new URL(this._s + "/rest/" + method + ".view");

    // 添加查询参数
    var queryParams = new URLSearchParams(params || {});

    // 添加额外的固定参数
    queryParams.append("v", this.serverAPIVersion);
    queryParams.append("f", "json");
    queryParams.append("c", "SubFire");
    queryParams.append("u", this._u);

    // 根据条件添加更多查询参数
    if (this._tt && this._ts) {
      queryParams.append("s", this._ts);
      queryParams.append("t", this._tt);
    } else if (this._p && this.largerThan113) {
      var s = Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, "");
      var t = toMD5(this._p + s);
      queryParams.append("s", s);
      queryParams.append("t", t);
    } else {
      // currently unsupported
      queryParams.append("p", this._encP);
    }

    // 将查询参数添加到 URI 中
    uri.search = queryParams.toString();

    return uri;
  },
  /**
   * Execute a Subsonic API method
   * @param {string} method
   * @param {object} params
   * @param {boolean} traditional
   * @returns httpFetch
   */
  _execute(method, params, traditional) {
    let uri = this._buildURI(method, params, traditional);
    let req = httpFetch(uri.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    req.promise = req.promise
      .then(({ body }) => {
        console.log(body);
        var reply = body["subsonic-response"];
        if (reply.status === "failed") {
          return Promise.reject(reply);
        }
        return reply;
      })
      .catch(function (err) {
        console.log(err);
        return Promise.reject(err);
      });
    return req;
  },

  open(server, username, bitrate, seed, token, ping) {
    // reset capabilities
    this.serverAPIVersion = "1.16.0";
    this._u = username;
    this._s = server;
    this._b = bitrate || "0";
    this._tt = token;
    this._ts = seed;
    return ping ? this.ping() : this;
  },

  ping() {
    return this._execute("ping");
  },

  getPlaylists(username) {
    if (username) {
      return this._execute("getPlaylists", { username });
    }
    return this._execute("getPlaylists");
  },
  getPlaylist(id) {
    return this._execute("getPlaylist", { id });
  },
  getPlaylistURL(id) {
    return `${this._s}/app/#/playlist/${id}/show`;
  },
  getMusicFolders() {
    return this._execute("getMusicFolders");
  },
  getIndexes(id) {
    var params =
      id === null || id === undefined
        ? {}
        : {
          musicFolderId: id,
        };
    return this._execute("getIndexes", params);
  },
  getMusicDirectory(id) {
    return this._execute("getMusicDirectory", {
      id,
    });
  },
  getGenres() {
    return this._execute("getGenres", {});
  },
  getArtists() {
    return this._execute("getArtists", {});
  },
  getArtist(id) {
    return this._execute("getArtist", { id });
  },
  getTopSongs(name, count) {
    return this._execute("getTopSongs", {
      artist: name,
      count: count || 50,
    });
  },
  getAlbum(id) {
    return this._execute("getAlbum", { id });
  },
  getAlbumURL(id) {
    return `${this._s}/app/#/album/${id}/show`;
  },
  getSong(id) {
    return this._execute("getSong", { id });
  },
  getAlbumList(type, params) {
    params = params || {};
    params.type = type;
    return this._execute("getAlbumList", params);
  },
  getAlbumList2(type, params) {
    params = params || {};
    params.type = type;
    return this._execute("getAlbumList2", params);
  },
  randomizeFolder(id, size) {
    var params =
      id === null || id === undefined
        ? {}
        : {
          musicFolderId: id,
        };
    params.size = size || 50;
    return this._execute("getRandomSongs", params);
  },
  getCoverArtURL(id, size) {
    var params = { id };
    if (size) params.size = size;
    var url = this._buildURI("getCoverArt", params);
    // var key = trimImageUrlEssentials(url);
    // var firstUrl = this.coverArtCache[key];
    // if (!firstUrl) {
    //   this.coverArtCache[key] = url;
    // } else {
    //   // console.log("match", "using", firstUrl, "instead of", url);
    //   url = firstUrl;
    // }
    return url;
  },
  getHLSURL(id, params) {
    params = $.extend(params || {}, {
      id,
      maxBitRate: this._b,
    });
    return this._buildURI("hls", params);
  },
  getStreamingURL(id, params) {
    params = $.extend(params || {}, {
      id,
      maxBitRate: this._b,
    });
    return this._buildURI("stream", params);
  },
  getDownloadURL(id) {
    return this._buildURI("download", { id });
  },
  getArtistInfo(id, useID3) {
    var method = useID3 ? "getArtistInfo2" : "getArtistInfo";
    var params = {
      id,
      count: 20,
    };
    return this._execute(method, params);
  },
  getSimilarSongs(id, useID3, count) {
    var method = useID3 ? "getSimilarSongs2" : "getSimilarSongs";
    var params = {
      id,
      count,
    };
    return this._execute(method, params);
  },
  search(search, useID3, params) {
    var method = useID3 ? "search3" : "search2";
    params.query = search;
    return this._execute(method, params);
  },
  searchArtist(query, size = 20, page = 1) {
    let req = this._execute("search3", {
      query,
      albumCount: 0,
      songCount: 0,
      artistCount: size,
      artistOffset: (page - 1) * size,
    });
    req.promise = req.promise.then((res) => {
      res["searchResult3"] = res.searchResult3.artist || [];
      return res;
    });
    return req;
  },
  searchAlbum(query, size = 20, page = 1) {
    let req = this._execute("search3", {
      query,
      albumCount: size,
      albumOffset: (page - 1) * size,
      songCount: 0,
      artistCount: 0,
    });
    req.promise = req.promise.then((res) => {
      res["searchResult3"] = res.searchResult3.album || [];
      return res;
    });
    return req;
  },
  searchSong(query, size = 20, page = 1) {
    let req = this._execute("search3", {
      query,
      albumCount: 0,
      songCount: size,
      songOffset: (page - 1) * size,
      artistCount: 0,
    });
    req.promise = req.promise.then((res) => {
      res["searchResult3"] = res.searchResult3.song || [];
      return res;
    });
    return req;
  },
  savePlayQueue(ids, current) {
    var method = "savePlayQueue";
    var params = {
      id: ids,
      current,
    };
    return this._execute(method, params, true);
  },
  getPlayQueue() {
    return this._execute("getPlayQueue", null);
  },
  getChatMessages(since) {
    if (typeof since === "function") {
      cb = since;
      since = null;
    }
    return this._execute(
      "getChatMessages",
      since
        ? {
          since,
        }
        : null
    );
  },
  addChatMessage(message) {
    return this._execute("addChatMessage", {
      message,
    });
  },
  createBookmark(id, position, comment) {
    var params = {
      id,
      position,
    };
    if (comment) params.comment = comment;
    return this._execute("createBookmark", params);
  },
  deleteBookmark(id) {
    var params = {
      id,
    };
    return this._execute("deleteBookmark", params);
  },
  getBookmarks() {
    return this._execute("getBookmarks", null);
  },
};

export default SubSonicFetch;
