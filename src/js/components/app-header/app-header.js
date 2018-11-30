import * as Web from '../web.js';

class AppHeader extends Web.Component {
  constructor () {
    super(import.meta.url);
  }
}

export default Web.registerComponent(AppHeader);
