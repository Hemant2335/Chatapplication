import express from 'express';
import WebSocket , {WebSocketServer} from 'ws';

const app = express();

const httpserver = app.listen(8080, () => {
    console.log('Server is running on port 8080');
});

const wss = new WebSocket.Server({ server: httpserver });

wss.on('connection' , function connection(ws){
    let user = 0
    console.log("User Connected are : " , ++user + "users");
    ws.on('message', function incoming(message){
        console.log('received: %s', message);
        wss.clients.forEach((clients)=>{
            ws.send('echo: ' + message);
        })
        
    });
    ws.send('Welcome to websocket server');
})