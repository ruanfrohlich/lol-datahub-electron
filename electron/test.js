process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const WebSocket = require('ws');

const MESSAGE_TYPES = {
    WELCOME: 0,
    PREFIX: 1,
    CALL: 2,
    CALLRESULT: 3,
    CALLERROR: 4,
    SUBSCRIBE: 5,
    UNSUBSCRIBE: 6,
    PUBLISH: 7,
    EVENT: 8
};

class RiotWSProtocol extends WebSocket {

    constructor(url) {
        super(url, 'wamp');

        this.session = null;
        this.on('message', this._onMessage.bind(this));
    }

    close() {
        super.close();
        this.session = null;
    }

    terminate() {
        super.terminate();
        this.session = null;
    }

    subscribe(topic, callback) {
        super.addListener(topic, callback);
        this.send(MESSAGE_TYPES.SUBSCRIBE, topic);
    }

    unsubscribe(topic, callback) {
        super.removeListener(topic, callback);
        this.send(MESSAGE_TYPES.UNSUBSCRIBE, topic);
    }

    send(type, message) {
        super.send(JSON.stringify([type, message]));
    }

    _onMessage(message) {
        const [type, ...data] = JSON.parse(message);

        switch (type) {
            case MESSAGE_TYPES.WELCOME:
                this.session = data[0];
                // this.protocolVersion = data[1];
                // this.details = data[2];
                break;
            case MESSAGE_TYPES.CALLRESULT:
                console.log('Unknown call');
                break;
            case MESSAGE_TYPES.TYPE_ID_CALLERROR:
                console.log('Unknown call error');
                break;
            case MESSAGE_TYPES.EVENT:
                const [topic, payload] = data;
                
                try {
                  const selectLegacy = payload.uri === '/lol-champ-select-legacy/v1/session'
                    && payload.eventType === 'Create'

                  const selectV1 = payload.uri === '/lol-champ-select/v1/session'
                    && payload.eventType === 'Create'

                  if (selectLegacy || selectV1)
                    this.emit(topic, 'Em seleção de campeão');
                } catch (error) {
                  //
                }
                break;
            default:
                console.log('Unknown type:', [type, data]);
                break;
        }
    }
}

/** HOW TO USE */
const username = 'riot';
const password = 'vVErpqvF7vEGI7cJaNk0ew';

const ws = new RiotWSProtocol(`wss://${username}:${password}@127.0.0.1:28918/`);

ws.on('open', () => {
    ws.subscribe('OnJsonApiEvent', console.log);
});