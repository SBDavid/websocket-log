const host = "ws://192.168.72.199:3000";

let websocket = null;
try {
    websocket = new WebSocket(host);
    websocket.addEventListener('open', () => {
        flushCache();
    })
}
catch(err) {
    console.log('WebsocketLogClient fail to connect server');
    console.log(err);
}

const cache = [];

function cacheRespest(data) {
    cache.push(data);
}

function flushCache() {
    cache.forEach((data) => {
        websocket.send(data);
    });
    cache.splice(0, cache.length);
}

export default {
    log: (data) => {
        try {
            if (websocket) {
                const res = JSON.stringify({
                    level: 'log',
                    log: data
                });

                if (websocket.readyState === 1) {
                    websocket.send(res);
                } else if (websocket.readyState === 0) {
                    cacheRespest(res);
                }

            }
        } catch(err) {
            console.log(err);
        }
    }
}