var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
var path = require('node:path');
var express = require('express');
var next = require('next');
var port = 3000;
var dev = process.env.NODE_ENV !== 'production';
var nextApp = next({ dev: dev });
var handle = nextApp.getRequestHandler();
var mainWindow = null;
var createWindow = function () {
    var win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
        },
    });
    mainWindow = win;
    if (dev) {
        win.loadURL("http://localhost:".concat(port));
        //win.webContents.openDevTools();
    }
    else {
        win.loadFile(path.join(__dirname, '../out/index.html'));
    }
};
app.whenReady().then(function () {
    // Inicia a escuta do webservice.
    connectToWebSocket();
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
function connectToWebSocket() {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    var WebSocket = require('ws');
    var username = 'riot';
    var password = 'Q5K72eCL9loeTRMk7Z_Ptg';
    var summonerId = 6943402;
    console.log("Listening wss://".concat(username, ":").concat(password, "@127.0.0.1:24885/"));
    var ws = new WebSocket("wss://".concat(username, ":").concat(password, "@127.0.0.1:24885/"), 'wamp');
    ws.on('open', function () {
        ws.send('[5, "OnJsonApiEvent"]');
    });
    ws.on('message', function (event) {
        var _a = JSON.parse(event.toString()), type = _a[0], data = _a.slice(1);
        switch (type) {
            case 8:
                var topic = data[0], payload = data[1];
                try {
                    var selectLegacy = payload.uri === '/lol-champ-select-legacy/v1/session'
                        && payload.eventType === 'Create';
                    var selectV1 = payload.uri === '/lol-champ-select/v1/session'
                        && payload.eventType === 'Create';
                    var updateLegacy = payload.uri === '/lol-champ-select-legacy/v1/session'
                        && payload.eventType === 'Update';
                    var updateV1 = payload.uri === '/lol-champ-select/v1/session'
                        && payload.eventType === 'Update';
                    if (selectLegacy || selectV1)
                        bringWindowToFront('');
                    if (updateLegacy || updateV1) {
                        var myData = payload.data.myTeam.find(function (data) {
                            return data.summonerId === 6943402;
                        });
                        if (myData) {
                            changeChampionData(myData.assignedPosition, myData.championId);
                        }
                    }
                }
                catch (error) {
                    //
                }
                break;
            default:
                // console.log('.');
                break;
        }
    });
}
function bringWindowToFront(assignedPosition) {
    if (mainWindow) {
        mainWindow.loadURL("http://localhost:".concat(port, "/champ-select/?assignedPosition=").concat(assignedPosition));
        mainWindow.show();
        mainWindow.focus();
        mainWindow.setAlwaysOnTop(true);
        setTimeout(function () { return mainWindow.setAlwaysOnTop(false); }, 3000);
    }
}
function changeChampionData(assignedPosition, championId) {
    if (mainWindow) {
        mainWindow.loadURL("http://localhost:".concat(port, "/champ-select/?assignedPosition=").concat(assignedPosition, "&championId=").concat(championId));
        mainWindow.show();
        mainWindow.focus();
    }
}
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
