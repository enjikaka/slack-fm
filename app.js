const menubar = require('menubar');

const mb = menubar({
  preloadWindow: true
});

mb.on('after-create-window', () => {
  mb.window.loadURL('https://slack-fm.firebaseapp.com');
});
