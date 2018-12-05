const menubar = require('menubar');

const mb = menubar();

mb.on('after-create-window', () => {
  mb.window.loadURL('https://slack-fm.firebaseapp.com');
});

mb.on('after-close', () => {
  mb.app.quit();
});
