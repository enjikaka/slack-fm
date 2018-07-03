import '../custom-button/custom-button.js';
import '../lastfm-profile-card/lastfm-profile-card.js';

class LastFMModule extends HTMLElement {
  static get observedAttributes () {
    return ['state'];
  }

  attributeChangedCallback (name, oldValue, newValue) {
    this.render();
  }

  connectedCallback () {
    this.render();
  }

  async render () {
    /** @type {'not-connected'|'connected'} */
    const state = this.getAttribute('state');

    let html;

    switch (state) {
      case 'connected':
        const user = await this.getUserInfo();
        html = `
          <lastfm-profile-card
            name="${user.name}"
            image="${user.image[0]['#text']}"
          ></lastfm-profile-card>
        `;
        break;
      case 'not-connected':
      default:
        html = '<custom-button id="connect-lastfm" class="lastfm" text="Connect to LastFM"></custom-button>';
        break;
    }

    this.innerHTML = html;

    this.registerEventListeners();
  }

  getUserInfo () {
    return new Promise(resolve => {
      document.dispatchEvent(new CustomEvent('last-fm:request:user-info'));

      document.addEventListener('last-fm:response:user-info', event => resolve(event.detail.user), { once: true });
    });
  }

  registerEventListeners () {
    document.addEventListener('last-fm:connected', () => {
      this.setAttribute('state', 'connected');
    });

    const connectLastFMButton = this.querySelector('#connect-lastfm');

    if (connectLastFMButton) {
      connectLastFMButton.addEventListener('click', () => {
        const apiKey = prompt('Enter a LastFM API Key');
        const username = prompt('Enter your username on LastFM');

        if (apiKey && username) {
          document.dispatchEvent(new CustomEvent('last-fm:request:connect', {
            detail: {
              apiKey,
              username
            }
          }));
        }
      });
    }
  }
}

window.customElements.define('lastfm-module', LastFMModule);