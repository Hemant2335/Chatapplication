import express from 'express';
import WebSocket , {WebSocketServer} from 'ws';

const app = express();

const httpserver = app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

const wss = new WebSocket.Server({ server: httpserver });
let user = 0;
wss.on('connection' , function connection(ws){
    ws.on('message', function incoming(message , isBinary){
        console.log('received: %s', message);
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(message, { binary: isBinary });
            }
          });
        
    });
    console.log("User Connected are : " , ++user + "users");
    ws.send('Welcome to websocket server');
})