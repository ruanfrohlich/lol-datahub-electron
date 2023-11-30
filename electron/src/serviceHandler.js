const { app } = require('electron');

const WindowManager = require('./window');
const LeagueOfLegendsWSS = require('./leagueOfLegendsWSS');

class ServiceHandler {
  
  /**
   * Creates a new instance of ServiceHandler.
   *
   * @constructor
   */
  constructor() {
    this.windowManager = new WindowManager();
    this.wss = new LeagueOfLegendsWSS(this.windowManager);
  
    this.windowManager.createWindow();
    this.wss.connectAndListenToWebSocket();

    app.on('activate', () => this.windowManager.onActivate());
  }
  
}

module.exports = ServiceHandler;