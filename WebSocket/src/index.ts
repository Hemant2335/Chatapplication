import express from 'express';
import WebSocket , {WebSocketServer} from 'ws';
import axios from "axios";

const app = express();

const httpserver = app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
const wss = new WebSocket.Server({ server: httpserver });

const User = new Map();


const handleMessages = async(data) => {
    const res = await axios.post('http://localhost:3000/api/chat/sendmessage' , data);
}

wss.on('connection' , function connection(ws){
    ws.on('message', function incoming(message , isBinary){
        const data = JSON.parse(message.toString());
        console.log(data);
        switch(data.type){
            case 'user':
                if(!User.has(data.id))
                User.set(data.id , ws);
                else ws.send('User already exists');
                break;
            
            case 'message':
                const{fromid , toid , message} = data;
                //Step 1 : Form a Chat between two users
                
                //Step 2 : Send message to the user

                //Step 3 : Save the message in database as status unread


                const user = User.get(data.id);
                if(user) (user as any).ws.send(data.message);
                break;
        }
        
    });
    ws.send('Welcome to websocket server with Users : ' + User.size);
})