"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
const app = (0, express_1.default)();
const httpserver = app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
const wss = new ws_1.default.Server({ server: httpserver });
let user = 0;
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message, isBinary) {
        console.log('received: %s', message);
        wss.clients.forEach(function each(client) {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(message, { binary: isBinary });
            }
        });
    });
    console.log("User Connected are : ", ++user + "users");
    ws.send('Welcome to websocket server');
});
