const menubar = require('menubar');

const mb = menubar({
  preloadWindow: true,
  icon: 'img/IconTemplate.png'
});

mb.on('after-create-window', () => {
  mb.window.loadURL('https://slack-fm.firebaseapp.com');
});

mb.on('window-all-closed', () => {
  mb.app.quit();
});
