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
wss.on('connection', function connection(ws) {
    let user = 0;
    console.log("User Connected are : ", ++user + ws.url + "users");
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        wss.clients.forEach((clients) => {
            ws.send('echo: ' + message);
        });
    });
    ws.send('Welcome to websocket server');
});
