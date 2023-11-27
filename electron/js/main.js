var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var path = require('node:path');
var express = require('express');
var next = require('next');
var port = 3000;
var dev = process.env.NODE_ENV !== 'production';
var nextApp = next({ dev: dev });
var handle = nextApp.getRequestHandler();
var createWindow = function () {
    var win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    if (dev) {
        win.loadURL("http://localhost:".concat(port));
        win.webContents.openDevTools();
    }
    else {
        win.loadFile(path.join(__dirname, '../out/index.html'));
    }
};
app.whenReady().then(function () {
    nextApp.prepare().then(function () {
        var server = express();
        server.all('*', function (req, res) {
            return handle(req, res);
        });
        server.listen(port, function (err) {
            if (err)
                throw err;
            console.log("Server running on http://localhost:".concat(port));
        });
        createWindow();
        app.on('activate', function () {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    });
});
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
