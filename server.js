require('app-module-path').addPath(__dirname);
const app = require('./src');

app
  .init()
  .start()
  .then(msg => console.info(msg))
  .catch(e => console.error(e.message));