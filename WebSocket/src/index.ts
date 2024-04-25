import express from "express";
import WebSocket, { WebSocketServer } from "ws";
import axios from "axios";

const app = express();

const httpserver = app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

const wss = new WebSocket.Server({ server: httpserver });

const User = new Map();

const handleMessages = async (data: any) => {
  console.log(data);
  const res = await axios.post("http://localhost:3000/api/chat/sendmessage", {
    token: data.token,
    toid: data.toid,
    message: data.message,
  });
  const newdata = res.data;
  console.log(newdata.chatId);
  const retdata = {
    Chatid: newdata.chatId,
    newchat: newdata.newchat,
  };
  return retdata;
};
wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message, isBinary) {
    const data = JSON.parse(message.toString());
    console.log(data);
    switch (data.type) {
      case "user":
        console.log(data.id);
        User.set(data.id, ws);
        let userSocket = User.get(data.id);
        userSocket.send(JSON.stringify({ Msg: "User Added" }));
        console.log("User connected with id", data.id);
        break;
      case "message":
        const handleMsg = async (data: any) => {
          let Chatid = data.Chatid;
          let newchat = false;
          console.log("J=heyyyy" , Chatid);
          if (Chatid == undefined) {
            console.log("NewChat found")
            const res = await handleMessages(data);
            Chatid = res.Chatid;
            newchat = res.newchat
          }
          console.log("Yaya !" , newchat);
          const newuserSocket = User.get(data.toid);
          const newuserSocket1 = User.get(data.fromid);
          if (newuserSocket1 && newchat) {
            newuserSocket1.send(
              JSON.stringify({
                ChatId: Chatid,
                fromUser: data.fromid,
                toUser: data.toid,
                message: data.message,
                newchat: newchat,
              })
            );
            console.log("Message sent to user", data.fromid);
          } else {
            console.log("User not found or disconnected");
            // Optionally handle the case where the user is not found or disconnected
          }
          if (newuserSocket) {
            newuserSocket.send(
              JSON.stringify({
                ChatId: Chatid,
                fromUser: data.fromid,
                toUser: data.toid,
                message: data.message,
                newchat: newchat,
              })
            );
            console.log("Message sent to user", data.toid);
          } else {
            console.log("User not found or disconnected");
            // Optionally handle the case where the user is not found or disconnected
          }
        };
        handleMsg(data);
        break;
    }
  });
  ws.send(JSON.stringify({ Msg: "Welcome to websocket server with Users" }));
});
