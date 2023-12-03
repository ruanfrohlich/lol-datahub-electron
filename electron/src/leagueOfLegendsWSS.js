const terminal = require('./terminal');
const WebSocket = require('ws');

class LeagueOfLegendsWSS {
  
  /**
   * Constructor function for the class.
   *
   * @param {Object} windowManager - The window manager object.
   */
  constructor(windowManager) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    this.windowManager = windowManager;  
    this.lastEvent = 'None';
  }
  
  /**
   * Connects to a WebSocket and listens for messages.
   * 
   * @return {void}
   */
  async connectAndListenToWebSocket() {
    const {appPort, authToken} = await terminal.getLeagueOfLegendsProccessInfo();

    const ws = new WebSocket(`wss://riot:${authToken}@127.0.0.1:${appPort}/`, 'wamp');

    ws.on('open', () => ws.send('[5, "OnJsonApiEvent"]'));

    ws.on('message', (event) => {
      const [type, ...data] = JSON.parse(event.toString());

      if (type === 8) {
        const [_, payload] = data;

        try {
          const eventName = this.getWSSEventName(payload.uri, payload.eventType)
          this.processPayload(eventName, payload.data)
        } catch (error) {
          console.log(error)
        }
      }
    })
  }

  /**
   * Returns the WSSEventName based on the given URI and eventType.
   *
   * @param {string} uri - The URI to check.
   * @param {string} eventType - The eventType to check.
   * @return {string} The WSSEventName based on the given URI and eventType.
   */
  getWSSEventName(uri, eventType) {
    let response = 'None';

    if (uri === '/lol-champ-select-legacy/v1/session' && eventType === 'Create') {
      response = 'selectLegacy'
    }

    if (uri === '/lol-champ-select/v1/session' && eventType === 'Create') {
      response = 'selectV1'
    }

    if (uri === '/lol-champ-select-legacy/v1/session' && eventType === 'Update') {
      response = 'updateLegacy'
    }

    if (uri === '/lol-champ-select/v1/session' && eventType === 'Update') {
      response = 'updateV1'
    }

    return response
  }

  /**
   * Process the payload for the given event name and payload data.
   *
   * @param {string} eventName - The name of the event.
   * @param {object} payloadData - The data associated with the event.
   */
  processPayload(eventName, payloadData) {
    if (eventName === 'None') return
    if (eventName === this.lastEvent) return

    if (eventName === 'selectLegacy' || eventName === 'selectV1') {
      const myData = payloadData.myTeam.find((data) => {
        return data.summonerId === 6943402 || data.summonerId === 3968244
      })

      if (myData) {
        this.windowManager.loadPage(`champion-suggestion/`, true)
        // Deve fazer esta acao apenas uma vez por lobby
        this.lastEvent = eventName
      }
    }

    if (eventName === 'updateLegacy' || eventName === 'updateV1') {
      const myData = payloadData.myTeam.find((data) => {
        return data.summonerId === 6943402 || data.summonerId === 3968244
      })

      if (myData && myData?.championId > 0) {
        this.windowManager.loadPage(`champion-select/?championId=${myData.championId}&assignedPosition=${myData.assignedPosition}`)
        this.lastEvent = 'None';
      }
    }
  }
}

module.exports = LeagueOfLegendsWSS;