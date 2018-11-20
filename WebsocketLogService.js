#!/usr/bin/env node

var ws = require('nodejs-websocket');
var chalk = require('chalk');

const port = 3000;

function printService(text) {
    console.log(chalk.bold.blue(text));
}

function log(log) {

    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;

    const type = typeof log;
    if (type === 'object') {

        logStr = JSON.stringify(log, null, 2);
        // 数据过大
        if (logStr.length > 1000) {
            printService('Object is to large');
        } else {
            console.log(`${timeStr.padEnd(15)} object:`);
            console.log(JSON.stringify(log, null, 2));
        }
    } else {
        console.log(`${timeStr.padEnd(15)}${log}`);
    }
}

const server = ws.createServer((conn) => {
    printService('WebSocket Log is connected');

    conn.on("text", function(text) {
        const data = JSON.parse(text);
        if (data.level === 'log') {
            log(data.log);
        }
    })

    conn.on("close",function(code,reason){
        printService("connection closed");
    });
    conn.on("error",function(err){
        printService("handle err")
        printService(err)
    });
});

server.listen(port);
printService('WebsocketLogService listening on port ' + port);