import * as Web from '../web.js';

class LastFmBox extends Web.Component {
  constructor () {
    super(import.meta.url);

    this.state = {
      username: localStorage.getItem('last-fm-username')
    };
  }

  render () {
    return this.state.username ? Web.html`
      <last-fm-user user="${this.state.username}"></last-fm-user>
      <last-fm-now-playing user="${this.state.username}"></last-fm-now-playing>
    ` : Web.html`
      <last-fm-username-chooser></last-fm-username-chooser>
    `;
  }
}

export default Web.registerComponent(LastFmBox);
