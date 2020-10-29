/** @typedef UserImage
 *  @prop {number} size
 *  @prop {string} url
 */

/** @typedef UserInfo
 *  @prop {string} playlists
 *  @prop {number} playcount
 *  @prop {string} gender
 *  @prop {string} name
 *  @prop {string} subscriber
 *  @prop {string} url
 *  @prop {string} country
 *  @prop {UserImage[]} image
 *  @prop {{ unixtime: number }} registered
 *  @prop {string} type
 *  @prop {string} age
 *  @prop {string} bootstrap
 *  @prop {string} realname
 */

function rewriteImageFormat (image) {
  const sizeToPixel = {
    small: 34,
    medium: 64,
    large: 174,
    extralarge: 300
  };

  image.url = image['#text'];
  image.size = image.size

  return {
    url: image['#text'] || 'https://lastfm-img2.akamaized.net/i/u/64s/c6f59c1e5e7240a4c0d427abd71f3dbb',
    size: sizeToPixel[image.size]
  };
}

/**
 * @returns {UserInfo} user
 */
function parseUserInfo (user) {
  const image = user.image.map(rewriteImageFormat);

  return {
    ...user,
    image
  };
}

let apiKey;

async function loadAPIKey() {
  if (apiKey) return;

  const response = await fetch('env.json');

  if (!response.ok) {
    throw new Error('No api config.');
  }

  const { LASTFM_API_KEY } = await response.json();

  apiKey = LASTFM_API_KEY;
}

export default class LastFM {
  static async 'User.getInfo' (user) {
    await loadAPIKey();

    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${user}&api_key=${apiKey}&format=json`;
    const response = await fetch(url);
    const json = await response.json();

    /** @type {UserInfo} */
    const userInfo = parseUserInfo(json.user);

    return userInfo;
  }

  static async 'User.getScrobblingTrack' (user) {
    await loadAPIKey();

    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${user}&api_key=${apiKey}&limit=1&extended=1&format=json`;
    const response = await fetch(url);
    const json = await response.json();
    const latestTrack = json.recenttracks.track[0];

    const image = latestTrack.image.map(rewriteImageFormat);

    return {
      url: latestTrack.url,
      title: latestTrack.name,
      artist: latestTrack.artist['#text'],
      image
    };
  }
}
