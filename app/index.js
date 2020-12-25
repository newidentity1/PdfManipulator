const {app, BrowserWindow} = require('electron');

app.on('ready', () => {
    const window = new BrowserWindow();
    window.loadFile('app/index.html');
});