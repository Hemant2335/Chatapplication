"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const axios_1 = __importDefault(require("axios"));
const wss = new ws_1.WebSocketServer({ port: 8080 });
// Map to store clients and groups
const clients = new Map();
const groups = new Map();
const handleCreateUser = (Id, client) => {
    clients.set(Id, client);
    console.log("User Created with Id", Id);
};
wss.on("connection", (ws) => {
    ws.send(JSON.stringify({ type: "id", id: ws.id }));
    ws.on("message", (message) => {
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
        }
        catch (error) {
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
function handleUpdateDatabase(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(data);
            const res = yield axios_1.default.post("http://localhost:3000/api/chat/sendmessage", {
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
        }
        catch (error) {
            console.log(error);
        }
    });
}
function handlePrivateMessage(sender, msg) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(msg);
        if (msg.toId && clients.has(msg.toId)) {
            const recipient = clients.get(msg.toId);
            if (recipient) {
                const sendMsg = {
                    type: "private",
                    fromUser: msg.fromId,
                    message: msg.message,
                    toUser: msg.toId,
                    createdAt: new Date()
                };
                recipient.send(JSON.stringify(sendMsg));
                console.log("Message sent to user", sendMsg);
                const data = yield handleUpdateDatabase(msg);
                // Now Creating new Chat if newchat is true and sending the chatId to the user and recipient
                if (data && data.newchat) {
                    sender.send(JSON.stringify({ type: "chatId", chatId: data.Chatid[0] }));
                    recipient.send(JSON.stringify({ type: "chatId", chatId: data.Chatid[1] }));
                }
            }
        }
        else {
            console.error("Recipient not found");
        }
    });
}
function handleGroupMessage(sender, msg) {
    if (msg.groupId && groups.has(msg.groupId)) {
        const group = groups.get(msg.groupId);
        if (group) {
            group.forEach((client) => {
                if (client !== sender) {
                    client.send(JSON.stringify({
                        type: "group",
                        from: sender.id,
                        groupId: msg.groupId,
                        content: msg.content,
                    }));
                }
            });
        }
    }
    else {
        console.error("Group not found");
    }
}
// Function to create a new group and add clients to it
function createGroup(groupId, clientIds) {
    const group = new Set();
    clientIds.forEach((clientId) => {
        if (clients.has(clientId)) {
            group.add(clients.get(clientId));
        }
    });
    groups.set(groupId, group);
}
console.log("WebSocket server is running on ws://localhost:8080");
