(async () => {
  const slackStore = {
    ...(JSON.parse(localStorage.getItem('slack-store')) || { teams: [] })
  };
  const code = new URLSearchParams(document.location.search).get('code');

  if (code) {
      const body = new FormData();

      body.append('client_id', '<slack_client_id>');
      body.append('client_secret', '<slack_client_secret>');
      body.append('code', code);

      const response = await fetch('https://slack.com/api/oauth.access', { method: 'POST', body });

      if (response.ok) {
        const json = await response.json();

        slackStore.teams.push({
          id: json.team_id,
          name: json.team_name,
          accessToken: json.access_token
        });

        localStorage.setItem('slack-store', JSON.stringify(slackStore));

        document.location.href = document.location.href.split('?')[0];
      } else {
        console.error(response);
      }
  }
})();

export function setStatus (artist, title) {
  const teams = localStorage.getItem('slack-store') !== null && JSON.parse(localStorage.getItem('slack-store')).teams;
  const tokens = teams.map(t => t.accessToken);

  tokens.forEach(token => {
    const body = new FormData();

    body.append('token', token);
    body.append('profile', JSON.stringify({
      'status_text': `${artist} - ${title}`,
      'status_emoji': ':musical_note:',
    }));

    const url = 'https://slack.com/api/users.profile.set';
    const options = { method: 'POST', body };

    fetch(url, options);
  });
}