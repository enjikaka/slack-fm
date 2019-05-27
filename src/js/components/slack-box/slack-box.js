import * as Web from '../web.js';

class SlackBox extends Web.Component {
  constructor () {
    super(import.meta.url);

    this.state = {
      teams: localStorage.getItem('slack-store') !== null && JSON.parse(localStorage.getItem('slack-store')).teams
    };
  }

  render () {
    const teams = this.state.teams ? this.state.teams.map(team => team.teamName).join(', ') : '';

    return Web.html`
      <small>
        ${teams ? `Settings song as status for these teams: ${teams}` : 'You are not connected to any Slack workspace. Press the menu on the top left and connect to one.'}
      </small>
    `;
  }
}

export default Web.registerComponent(SlackBox);
