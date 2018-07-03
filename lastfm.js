export default class LastFM {
  constructor (user, key) {
    if (
      !user ||
      !key
    ) {
      throw new Error('No user or key');
    }

    try {
      const userInfo = this.verifyUserAndKey(user, key);
    } catch (e) {
      console.error(e);
    }

    this._user = user;
    this._key = key;
  }

  async verifyUserAndKey (user, key) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getInfo&user=${user}&api_key=${key}&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Invalid API key');
      }

      if (response.status === 404) {
        throw new Error('User not found');
      }

      throw new Error(response.statusText);
    }

    const json = await response.json();

    return json;
  }

  verifyInitialization () {
    if (
      !this._key ||
      !this._user
    ) {
      throw new Error('LastFM has not been initialized with a correct key or user.');
    }
  }

  async getUserInfo () {
    this.verifyInitialization();

    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getInfo&user=${this._user}&api_key=${this._key}&format=json`;
    const response = await fetch(url);
    const json = await response.json();

    return json.user;
  }

  async getLatestTrack () {
    this.verifyInitialization();

    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${this._user}&api_key=${this._key}&format=json`;
    const response = await fetch(url);
    const json = await response.json();
    const latestTrack = json.recenttracks.track[0];

    /*
      The currently scrobbling track does not have a date,
      it will get a date when it is finished playing.

      Use that to detect if user is no longer scrobbling.
    */
    if (latestTrack.date) {
      return new Error('Not scrobbling.');
    }

    return {
      title: latestTrack.name,
      artist: latestTrack.artist['#text']
    };
  }
}