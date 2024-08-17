import WebSocket, { WebSocketServer } from "ws";
import axios from "axios";

// Define types
type Client = WebSocket & { id?: string };

const wss = new WebSocketServer({ port: 8080 });

// Map to store clients and groups
const clients = new Map<string, Client>();
const groups = new Map<string, Set<string>>();

const handleCreateUser = async (Id: string, client: Client) => {
  // Add client to the clients map
  clients.set(Id, client);

  try {
    // Fetch groups that the user is part of
    const usersGroups = await handlegetGroupUsers(Id);
    console.log(usersGroups);

    // Iterate over each group the user belongs to
    usersGroups.forEach((item: any) => {
      if (groups.has(item.id)) {
        const groupClients = groups.get(item.id);
        if (groupClients?.has(Id)) {
          return; // Client is already part of the group, no need to add
        }
        groupClients?.add(Id);
      } else {
        // Create a new group and add the client
        groups.set(item.id, new Set([Id]));
      }
    });

    console.log("Groups:", groups);
    console.log("User Created with Id", Id);
  } catch (error) {
    console.error("Error in handleCreateUser:", error);
  }
};


const handleCreateGroup = (msg: any) => {
  // Add group to the groups map
  console.log("Group Created", msg);
  groups.set(msg.group.id, new Set(msg.users));

  // Add users to group
  const newgroup = msg.group;
  newgroup.users = msg.users;
  // Now send the group to all the users in the group
  msg.users.forEach((user: any) => {
    const client = clients.get(user.id);
    if (client) {
      client.send(JSON.stringify({ type: "creategroup", group : newgroup }));
      console.log("Message sent to user", user.name);
    }
  });
}


wss.on("connection", (ws: Client) => {
  ws.send(JSON.stringify({ type: "id", id: ws.id }));
  ws.on("message", (message: string) => {
    try {
      const msg = JSON.parse(message.toString());
      console.log("Received message:", msg);
      switch (msg.type) {
        case "private":
          handlePrivateMessage(ws, msg);
          break;
        case "createUser":
          handleCreateUser(msg.id, ws);
          break;
        case "creategroup":
          handleCreateGroup(msg );
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

const handleUpdateGroupDatabase = async (data: any) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/chat/sendMessagesGroup",
      {
        token: data.token,
        groupid: data.groupId,
        message: data.content,
      }
    );
    const newdata = res.data;
    return;
  } catch (error) {
    console.log("Cannot able to update group message");
  }
};

type message = {
  id?: String;
  type: String;
  message: String;
  createdAt: Date;
  fromUser: String;
  toUser: String;
};

async function handlePrivateMessage(sender: Client, msg: any) {
  if (msg.toId && clients.has(msg.toId)) {
    const recipient = clients.get(msg.toId);
    if (recipient) {
      const sendMsg: message = {
        type: "private",
        fromUser: msg.fromId,
        message: msg.message,
        toUser: msg.toId,
        createdAt: new Date(),
      };
      recipient.send(JSON.stringify(sendMsg));
      console.log("Message sent to user", sendMsg);
      const data = await handleUpdateDatabase(msg);
      // Now Creating new Chat if newchat is true and sending the chatId to the user and recipient
      if (data && data.newchat) {
        sender.send(JSON.stringify({ type: "chatId", chatId: data.Chatid[0] }));
        recipient.send(
          JSON.stringify({ type: "chatId", chatId: data.Chatid[1] })
        );
      }
    }
  } else {
    console.error("Recipient not found");
  }
}

const handlegetGroupUsers = async (id: string) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/api/chat/getusersgroup",
      {
        id: id,
      }
    );
    return res.data.groups;
  } catch (error) {
    console.log(error);
  }
};

async function handleGroupMessage(sender: Client, msg: any) {
  console.log("Mai run ", msg);
  if (msg.groupId) {
    console.log(groups, msg.groupId);
    const group = groups.get(msg.groupId);
    console.log("The Group ", group);
    if (group) {
      group.forEach((Id) => {
        const client = clients.get(Id);
        if (!client) {
          console.log("User not found");
          return;
        }
        if (client !== sender) {
          client.send(
            JSON.stringify({
              type: "group",
              from: msg.fromId,
              groupId: msg.groupId,
              content: msg.content,
            })
          );
          console.log(
            "Message sent to group",
            JSON.stringify({
              type: "group",
              from: msg.fromId,
              groupId: msg.groupId,
              content: msg.content,
            })
          );
        }
      });
    }
    // Update the database

    const data = await handleUpdateGroupDatabase(msg);
  } else {
    console.error("Group not found");
  }
}

console.log("WebSocket server is running on ws://localhost:8080");
