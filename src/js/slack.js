import LastFM from './lastfm.js';

let clientId;
let clientSecret;

async function loadClientConfig() {
  if (clientId && clientSecret) return;

  const response = await fetch('env.json');

  if (!response.ok) {
    throw new Error('No api config.');
  }

  const { SLACK_CLIENT_ID, SLACK_CLIENT_SECRET } = await response.json();

  clientId = SLACK_CLIENT_ID;
  clientSecret = SLACK_CLIENT_SECRET;
}

(async () => {
  const slackStore = {
    ...(JSON.parse(localStorage.getItem('slack-store')) || { teams: [] })
  };
  const code = new URLSearchParams(document.location.search).get('code');

  if (code) {
      const body = new FormData();

      await loadClientConfig();

      body.append('client_id', clientId);
      body.append('client_secret', clientSecret);
      body.append('code', code);

      const response = await fetch('https://slack.com/api/oauth.access', { method: 'POST', body });

      if (response.ok) {
        const json = await response.json();

        slackStore.teams.push({
          teamId: json.team_id,
          teamName: json.team_name,
          accessToken: json.access_token,
          userId: json.user_id
        });

        localStorage.setItem('slack-store', JSON.stringify(slackStore));

        document.location.href = document.location.href.split('?')[0];
      } else {
        console.error(response);
      }
  }
})();

window.onunload = () => {
  resetStatusesFromBeforeScrobbling();
};

export function resetStatusesFromBeforeScrobbling () {
  const teams = localStorage.getItem('slack-store') !== null && JSON.parse(localStorage.getItem('slack-store')).teams;

  if (!teams) return;

  teams.forEach(async ({ teamId, userId }) => {
    const statusBeforeScrobbling = JSON.parse(localStorage.getItem(`${teamId}:${userId}:prescrobble-status`));

    if (statusBeforeScrobbling) {
      setStatus(statusBeforeScrobbling.text, statusBeforeScrobbling.emoji).then(console.log);
    }
  });
}

export async function getStatus (accessToken, userId) {
  const params = new URLSearchParams();

  params.append('token', accessToken);
  params.append('user', userId);

  const url = `https://slack.com/api/users.profile.get?${params.toString()}`;

  const response = await fetch(url);
  const json = await response.json();

  return {
    text: json.profile.status_text,
    emoji: json.profile.status_emoji
  };
}

export async function setStatus (text = 'Not listening to music right now.', emoji = ':musical_note:') {
  const teams = localStorage.getItem('slack-store') !== null && JSON.parse(localStorage.getItem('slack-store')).teams;

  if (!teams) return;

  return await teams.forEach(async ({ accessToken, teamId, userId }) => {
    const body = new FormData();

    const statusBeforeScrobbling = localStorage.getItem(`${teamId}:${userId}:prescrobble-status`);

    if (!statusBeforeScrobbling) {
      const status = await getStatus(accessToken, userId);
      localStorage.setItem(`${teamId}:${userId}:prescrobble-status`, JSON.stringify(status));
    }


    const IN_TEN_MINUTES_AS_SECONDS = Math.ceil((Date.now() / 1000) + 600);
    let statusExpiration = IN_TEN_MINUTES_AS_SECONDS;

    const lastFMUserame = localStorage.getItem('last-fm-username');

    if (lastFMUserame) {
      const { artist, title } = await LastFM["User.getScrobblingTrack"](lastFMUserame);
      const url = new URL('https://wt-43e42263dca67ab0063b88edf7ca290e-0.sandbox.auth0-extend.com/spotify-search-duration');
      url.searchParams.set('q', `${artist} ${title}`);
      const response = await fetch(url.toString());
      const durationMs = await response.json();

      statusExpiration = durationMs / 1000;
    }

    body.append('token', accessToken);
    body.append('profile', JSON.stringify({
      'status_text': text,
      'status_emoji': emoji,
      'status_expiration': statusExpiration,
    }));

    const url = 'https://slack.com/api/users.profile.set';
    const options = { method: 'POST', body };

    const reponse = await fetch(url, options);

    return reponse.ok;
  });
}