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
const express_1 = __importDefault(require("express"));
const ws_1 = __importDefault(require("ws"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const httpserver = app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
const wss = new ws_1.default.Server({ server: httpserver });
const User = new Map();
const handleMessages = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(data);
    const res = yield axios_1.default.post("http://localhost:3000/api/chat/sendmessage", {
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
});
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
                const handleMsg = (data) => __awaiter(this, void 0, void 0, function* () {
                    const { Chatid, newchat } = yield handleMessages(data);
                    console.log(Chatid);
                    const newuserSocket = User.get(data.toid);
                    const newuserSocket1 = User.get(data.fromid);
                    if (newuserSocket1 && newchat) {
                        newuserSocket1.send(JSON.stringify({
                            ChatId: Chatid,
                            fromUser: data.fromid,
                            toUser: data.toid,
                            message: data.message,
                            newchat: newchat,
                        }));
                        console.log("Message sent to user", data.fromid);
                    }
                    else {
                        console.log("User not found or disconnected");
                        // Optionally handle the case where the user is not found or disconnected
                    }
                    if (newuserSocket) {
                        newuserSocket.send(JSON.stringify({
                            ChatId: Chatid,
                            fromUser: data.fromid,
                            toUser: data.toid,
                            message: data.message,
                            newchat: newchat,
                        }));
                        console.log("Message sent to user", data.toid);
                    }
                    else {
                        console.log("User not found or disconnected");
                        // Optionally handle the case where the user is not found or disconnected
                    }
                });
                handleMsg(data);
                break;
        }
    });
    ws.send(JSON.stringify({ Msg: "Welcome to websocket server with Users" }));
});
