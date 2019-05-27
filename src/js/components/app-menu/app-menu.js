import * as Web from '../web.js';

class AppMenu extends Web.Component {
  constructor () {
    super(import.meta.url);
  }

  componentDidMount () {
    this.$('#log-out').addEventListener('click', () => {
      localStorage.removeItem('last-fm-username');
      document.location.reload();
    });

    this.$('#close').addEventListener('click', () => window.close());

    this.$('#slack-connect').addEventListener('click', () => {
      window.open('https://slack.com/oauth/authorize?scope=users.profile%3Awrite,users.profile%3Aread&client_id=3673527425.490642082464');
    });

    document.addEventListener('menu:toggle', () => {
      const open = this.getAttribute('open');

      if (open) {
        this.removeAttribute('open');
      } else {
        this.setAttribute('open', 'open');
      }
    });
  }
}

export default Web.registerComponent(AppMenu);
