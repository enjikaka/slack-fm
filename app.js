const menubar = require('menubar');

const mb = menubar({
  dir: './'
});

mb.on('ready', () => {
  console.log('App is ready');
});
