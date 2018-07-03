import Storage from './store.js';
import LastFM from './lastfm.js';

import './components/lastfm-module/lastfm-module.js';
import './components/slack-module/slack-module.js';

const storage = new Storage('browser');

let lastfm;
let slack;

// Native fake redux ;)

document.addEventListener('DOMContentLoaded', async () => {
  const lastFMConfig = await storage.getItem('lastfm-config');

  if (lastFMConfig) {
    const { username, apiKey } = lastFMConfig;

    lastfm = new LastFM(username, apiKey);
    document.dispatchEvent(new CustomEvent('last-fm:connected'));
  }
});

document.addEventListener('last-fm:request:connect', event => {
  const { apiKey, username } = event.detail;

  storage.setItem('lastfm-config', JSON.stringify({
    username, apiKey
  }));

  lastfm = new LastFM(username, apiKey);

  document.dispatchEvent(new CustomEvent('last-fm:connected'));
});

document.addEventListener('last-fm:request:user-info', async () => {
  const user = await lastfm.getUserInfo();

  document.dispatchEvent(new CustomEvent('last-fm:response:user-info', {
    detail: {
      user
    }
  }));
});