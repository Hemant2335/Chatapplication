import WebSocket, { WebSocketServer } from "ws";
import axios from "axios";

// Define types
type Client = WebSocket & { id?: string };

const wss = new WebSocketServer({ port: 8080 });

// Map to store clients and groups
const clients = new Map<string, Client>();
const groups = new Map<string, Set<Client>>();

const handleCreateUser = (Id: string, client: Client) => {
  clients.set(Id, client);
  console.log("User Created with Id", Id);
};

wss.on("connection", (ws: Client) => {
  ws.send(JSON.stringify({ type: "id", id: ws.id }));
  ws.on("message", (message: string) => {
    try {
      const msg = JSON.parse(message.toString());

      switch (msg.type) {
        case "private":
          handlePrivateMessage(ws, msg);
          break;
        case "createUser":
          handleCreateUser(msg.id, ws);
          break;
        case "group":
          handleGroupMessage(ws, msg);
          break;
        default:
          console.error("Unknown message type:", msg.type);
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  ws.on("close", () => {
    // Remove client from map
    if (ws.id) {
      clients.delete(ws.id);
    }
  });
});

async function handleUpdateDatabase(data: any) {
  try {
    console.log(data);
    const res = await axios.post("http://localhost:3000/api/chat/sendmessage", {
      token: data.token,
      toid: data.toId,
      message: data.message,
    });
    const newdata = res.data;
    console.log(newdata.chatId);
    const retdata = {
      Chatid: newdata.chatId,
      newchat: newdata.newchat,
    };
    return retdata;
  } catch (error) {
    console.log(error);
  }
}

type message = {
  id?: String;
  type : String
  message: String;
  createdAt: Date;
  fromUser: String;
  toUser: String;
};


async function handlePrivateMessage(sender: Client, msg: any) {
  console.log(msg);
  if (msg.toId && clients.has(msg.toId)) {
    const recipient = clients.get(msg.toId);
    if (recipient) {
      const sendMsg : message = {
        type: "private",
        fromUser: msg.fromId,
        message: msg.message,
        toUser: msg.toId,
        createdAt : new Date()
      };
      recipient.send(JSON.stringify(sendMsg));
      console.log("Message sent to user", sendMsg);
      const data = await handleUpdateDatabase(msg);
      // Now Creating new Chat if newchat is true and sending the chatId to the user and recipient
      if (data && data.newchat) {
        sender.send(JSON.stringify({ type: "chatId", chatId: data.Chatid[0]}));
        recipient.send(JSON.stringify({ type: "chatId", chatId: data.Chatid[1] }));
      }
    }
  } else {
    console.error("Recipient not found");
  }
}

function handleGroupMessage(sender: Client, msg: any) {
  if (msg.groupId && groups.has(msg.groupId)) {
    const group = groups.get(msg.groupId);
    if (group) {
      group.forEach((client) => {
        if (client !== sender) {
          client.send(
            JSON.stringify({
              type: "group",
              from: sender.id,
              groupId: msg.groupId,
              content: msg.content,
            })
          );
        }
      });
    }
  } else {
    console.error("Group not found");
  }
}

// Function to create a new group and add clients to it
function createGroup(groupId: string, clientIds: string[]) {
  const group = new Set<Client>();
  clientIds.forEach((clientId) => {
    if (clients.has(clientId)) {
      group.add(clients.get(clientId)!);
    }
  });
  groups.set(groupId, group);
}

console.log("WebSocket server is running on ws://localhost:8080");
