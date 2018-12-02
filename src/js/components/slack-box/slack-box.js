import * as Web from '../web.js';

class SlackBox extends Web.Component {
  constructor () {
    super(import.meta.url);

    this.state = {
      teams: localStorage.getItem('slack-store') !== null && JSON.parse(localStorage.getItem('slack-store')).teams
    };
  }

  componentDidMount () {
    this.$('a').addEventListener('click', e => {
      e.preventDefault();
      window.open(e.target.href, '_blank', 'nodeIntegration=no');
    });
  }

  render () {
    const teams = this.state.teams ? this.state.teams.map(team => team.name).join(', ') : '';

    return Web.html`
      ${this.state.teams ? `<span>Settings song as status for these teams: ${teams}</span><br>` : ''}
      <a href="https://slack.com/oauth/authorize?scope=users.profile%3Awrite&client_id=3673527425.490642082464">
        <img src="https://platform.slack-edge.com/img/sign_in_with_slack.png" srcset="https://platform.slack-edge.com/img/sign_in_with_slack.png 1x, https://platform.slack-edge.com/img/sign_in_with_slack@2x.png 2x" />
      </a>
    `;
  }
}

export default Web.registerComponent(SlackBox);
