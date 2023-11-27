const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const express = require('express');
const next = require('next');
const { hostname } = require('node:os');
const port = 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if (dev) {
    win.loadURL(`http://${hostname}:${port}`);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../out/index.html'));
  }
};

app.whenReady().then(() => {
  nextApp.prepare().then(() => {
    const server = express();

    server.all('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(port, (err) => {
      if (err) throw err;
      console.log(`Runing on port ${port}, dev: ${dev}`);
    });

    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
