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
const User = new Map();
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(message, isBinary) {
        const data = JSON.parse(message.toString());
        console.log(data);
        switch (data.type) {
            case 'user':
                if (!User.has(data.id))
                    User.set(data.id, ws);
                else
                    ws.send('User already exists');
                break;
            case 'message':
                const user = User.get(data.id);
                if (user)
                    user.ws.send(data.message);
                break;
        }
    });
    ws.send('Welcome to websocket server with Users : ' + User.size);
});
