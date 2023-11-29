const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const express = require('express');
const next = require('next');
const port = 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

let mainWindow: typeof BrowserWindow | null = null;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  });

  mainWindow = win;

  if (dev) {
    win.loadURL(`http://localhost:${port}`);
    //win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../out/index.html'));
  }
};

app.whenReady().then(() => {
  // Inicia a escuta do webservice.
  connectToWebSocket();

  nextApp.prepare().then(() => {
    const server = express();

    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`Server running on http://localhost:${port}`);
    });

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
});

function connectToWebSocket() {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const WebSocket = require('ws');

  const username = 'riot';
  const password = 'Q5K72eCL9loeTRMk7Z_Ptg';
  const summonerId = 6943402

  console.log(`Listening wss://${username}:${password}@127.0.0.1:24885/`);
  const ws = new WebSocket(`wss://${username}:${password}@127.0.0.1:24885/`, 'wamp');

  ws.on('open', () => {
    ws.send('[5, "OnJsonApiEvent"]');
  });

  ws.on('message', (event) => {
    const [type, ...data] = JSON.parse(event.toString());

    switch (type) {
      case 8:
        const [topic, payload] = data;

        try {
          const selectLegacy = payload.uri === '/lol-champ-select-legacy/v1/session'
            && payload.eventType === 'Create'

          const selectV1 = payload.uri === '/lol-champ-select/v1/session'
            && payload.eventType === 'Create'

            const updateLegacy = payload.uri === '/lol-champ-select-legacy/v1/session'
            && payload.eventType === 'Update'

          const updateV1 = payload.uri === '/lol-champ-select/v1/session'
            && payload.eventType === 'Update'

          if (selectLegacy || selectV1)
            bringWindowToFront('');

          if (updateLegacy || updateV1) {
            const myData = payload.data.myTeam.find((data) => {
              return data.summonerId === 6943402
            })
            
            if (myData) {
              changeChampionData(myData.assignedPosition, myData.championId)
            }
          }
        } catch (error) {
          //
        }
        break;
      default:
        // console.log('.');
        break;
    }
  })
}

function bringWindowToFront(assignedPosition: string) {
  if (mainWindow) {
    mainWindow.loadURL(`http://localhost:${port}/champ-select/?assignedPosition=${assignedPosition}`);
    mainWindow.show();
    mainWindow.focus();
    mainWindow.setAlwaysOnTop(true);
    setTimeout(() => mainWindow.setAlwaysOnTop(false), 3000);
  }
}

function changeChampionData(assignedPosition: string, championId: string) {
  if (mainWindow) {
    mainWindow.loadURL(`http://localhost:${port}/champ-select/?assignedPosition=${assignedPosition}&championId=${championId}`);
    mainWindow.show();
    mainWindow.focus();
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});