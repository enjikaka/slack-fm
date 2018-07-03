class Slack  {
  constructor (tokens) {
    if (!tokens) throw new Error('No token provided');
    this._tokens = tokens.indexOf(',') !== -1 ? tokens.split(',') : [tokens];
    this._latestStatus = undefined;
  }

  async setStatus (text) {
    const formData = new FormData();

    if (text === this._latestStatus) {
      throw new Error('Already status');
    }

    this._latestStatus = text;

    this._tokens.forEach(token => {
      formData.append('token', token);
      formData.append('profile', JSON.stringify({
        'status_text': text,
        'status_emoji': ':musical_note:',
      }));

      const url = 'https://slack.com/api/users.profile.set';
      const options = { method: 'POST', body: formData };

      // TODO: Error handling here
      fetch(url, options);
    });
  }
}