import './slack.js';
import './components/app-header/app-header.js';
import './components/app-menu/app-menu.js';
import './components/sign-in/sign-in.js';
import './components/last-fm-box/last-fm-box.js';
import './components/last-fm-user/last-fm-user.js';
import './components/last-fm-now-playing/last-fm-now-playing.js';
import './components/last-fm-username-chooser/last-fm-username-chooser.js';
import './components/slack-box/slack-box.js';

const lastFMUser = localStorage.getItem('last-fm-username');

if (lastFMUser) {
  document.body.querySelector('main').appendChild(
    document.createElement('last-fm-box')
  );

  document.body.querySelector('main').appendChild(
    document.createElement('slack-box')
  );
} else {
  document.body.querySelector('main').appendChild(
    document.createElement('sign-in')
  );
}
