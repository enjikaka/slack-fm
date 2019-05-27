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
