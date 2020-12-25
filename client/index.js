const {app, BrowserWindow} = require('electron');
require('../server/app.js'); 

app.on('ready', () => {
    const window = new BrowserWindow();
    window.loadFile('client/index.html');
});