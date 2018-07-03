import * as Web from '../../web.js';

class CustomButton extends Web.Component {
  constructor () {
    super(import.meta.url);
  }

  postRender () {
    this.$('button').textContent = this.getAttribute('text');
    this.$('button').classList.add(this.className);
  }
}

window.customElements.define('custom-button', CustomButton);
