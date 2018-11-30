const menubar = require('menubar');

const mb = menubar({
  dir: './src'
});

mb.on('ready', () => {
  console.log('App is ready');
});
