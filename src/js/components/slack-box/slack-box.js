import * as Web from '../web.js';

class SlackBox extends Web.Component {
  constructor () {
    super(import.meta.url);

    this.state = {
      teams: localStorage.getItem('slack-store') !== null && JSON.parse(localStorage.getItem('slack-store')).teams
    };
  }

  render () {
    const teams = this.state.teams ? this.state.teams.map(team => team.name).join(', ') : '';

    return Web.html`
      <span>Settings song as status for these teams: ${teams}</span><br>
      <a href="https://slack.com/oauth/authorize?scope=users.profile%3Awrite&client_id=3673527425.490642082464">Connect to a Slack-team.</a>
    `;
  }
}

export default Web.registerComponent(SlackBox);
