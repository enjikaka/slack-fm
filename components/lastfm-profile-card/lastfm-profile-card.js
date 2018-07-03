import * as Web from '../../web.js';

class LastFMProfileCard extends Web.Component {
  constructor () {
    super(import.meta.url);
  }

  getState () {
    return {
      name: this.getAttribute('name'),
      image: this.getAttribute('image')
    }
  }
}

window.customElements.define('lastfm-profile-card', LastFMProfileCard);
