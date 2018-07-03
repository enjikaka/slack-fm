class SlackModule extends HTMLElement {
  static get observedAttributes () {
    return ['state'];
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (!oldValue) return;
    this.render();
  }

  connectedCallback () {
    this.render();
  }

  render () {
    /** @type {'not-connected'|'connected'} */
    const state = this.getAttribute('state');

    let html;

    switch (state) {
      case 'connected':
        html = '*logged in information*';
        break;
      case 'not-connected':
      default:
        html = '<custom-button class="slack" text="Connect to a Slack-group"></custom-button>';
        break;
    }

    this.innerHTML = html;
  }
}

window.customElements.define('slack-module', SlackModule);