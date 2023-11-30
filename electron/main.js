require('dotenv').config()

const { app } = require('electron');
const express = require('express');
const next = require('next');
const nextApp = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = nextApp.getRequestHandler();
const utils = require('./src/utils');
const ServiceHandler = require('./src/serviceHandler');

app.whenReady().then(() => {
  nextApp.prepare().then(() => {
    const server = express();

    server.all('*', (req, res) => handle(req, res));

    server.listen(process.env.EXPRESS_PORT, (err) => {
      if (err) throw err;
    });
  
    new ServiceHandler();
  });
});

app.on('window-all-closed', () => utils.closeOSXApp());