import * as Web from '../web.js';

class AppHeader extends Web.Component {
  constructor () {
    super(import.meta.url);
  }

  componentDidMount () {
    this.$('button').addEventListener('click', () => {
      document.dispatchEvent(new CustomEvent('menu:toggle'));
    });
  }
}

export default Web.registerComponent(AppHeader);
