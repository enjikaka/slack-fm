import * as Web from '../web.js';

class LastFmUsernameChooser extends Web.Component {
  constructor () {
    super(import.meta.url);
  }

  componentDidMount () {
    this.$('button').addEventListener('click', () => {
      localStorage.setItem('last-fm-username', this.$('input').value);
      document.location.reload();
    });
  }

  render () {
    return Web.html`
      <span>LastFM Username</span><br>
      <input type="text"><br>
      <button>Set username</button>
    `;
  }
}

export default Web.registerComponent(LastFmUsernameChooser);
