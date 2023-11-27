var contextBridge = require('electron').contextBridge;
contextBridge.exposeInMainWorld('app', {});
