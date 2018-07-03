class LastFM {
  constructor (user, key) {
    if (
      !user ||
      !key
    ) {
      throw new Error('No user or key');
    }

    this._user = user;
    this._key = key;
  }

  async getLatestTrack () {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${this._user}&api_key=${this._key}&format=json`;
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