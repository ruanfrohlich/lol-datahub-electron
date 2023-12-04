const { BrowserWindow } = require('electron');
const path = require('node:path');
require('dotenv').config()

class WindowManager {
  
  /**
   * Creates a new instance of WindowManager.
   *
   * @constructor
   */
  constructor () {
    this.window = null;
    this.express_url = `http://localhost:${process.env.EXPRESS_PORT}`;
    this.devMode = process.env.NODE_ENV !== 'production';
  }

  /**
   * Handle app 'activate' event.
   *
   * @return {void} No return value.
   */
  onActivate() {
    if (BrowserWindow.getAllWindows().length === 0) {
      this.createWindow();
    }
  }

  /**
   * Creates a new window for the application.
   *
   * @return {void} No return value.
   */
  createWindow() {
    this.window = new BrowserWindow({
      width: 1280,
      height: 720,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
        nodeIntegration: true,
      },
    });

    this.devMode && this.window.webContents.openDevTools();

    this.window.loadURL(this.express_url);
    // if (this.devMode) {
    //   this.window.loadURL(this.express_url);
    // } else {
    //   this.window.loadFile(path.join(__dirname, '../out/index.html'));
    // }
  };

  /**
   * Load a page and optionally display it as a modal.
   *
   * @param {string} path - The path of the page to load.
   * @param {string} show - Whether to display the window. Default is false.
   * @return {void}
   */
  loadPage(path, show = false) {
    if (this.window !== null) {
      this.window.loadURL(`${this.express_url}/${path}`);

      if (show) {
        this.window.show();
        this.window.focus();
        this.window.setAlwaysOnTop(true);
        setTimeout(() => this.window.setAlwaysOnTop(false), 1000);
      }
    }
  }
}

module.exports = WindowManager;