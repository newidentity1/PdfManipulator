const {app, BrowserWindow} = require('electron');
require('../server/app.js'); 

app.on('ready', () => {
    const window = new BrowserWindow({title: "Pdf Manipulator"});
    window.removeMenu();
    window.maximize();
    window.loadFile('client/index.html');
});