import * as Web from '../web.js';

class SignIn extends Web.Component {
  constructor () {
    super(import.meta.url);
  }

  componentDidMount () {
    const input = this.$('#last-fm-username');
    const button = this.$('#last-fm-continue-button');

    button.addEventListener('click', () => {
      this.classList.add('last-fm-load');
      localStorage.setItem('last-fm-username', input.value);

      document.body.querySelector('main').appendChild(
        document.createElement('last-fm-box')
      );

      document.body.querySelector('main').appendChild(
        document.createElement('slack-box')
      );

      setTimeout(() => {
        this.classList.add('last-fm-done');
        document.body.classList.add('logged-in');

        setTimeout(() => {
          this.remove();
        }, 1500);
      }, 1000);
    });
  }
}

export default Web.registerComponent(SignIn);
