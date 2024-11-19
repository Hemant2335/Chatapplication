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
const router = express_1.default.Router();
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
router.post("/sendmessage", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, toid, message, id } = req.body;
    let fromid;
    if (!token) {
        return res.status(401).json({ Status: false, error: "No Token Provided" });
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        req.body.user = user;
        fromid = user.id;
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ Status: false, error: "Unauthorized" });
    }
    try {
        // Check if Chat already Exists
        const chat = yield prisma.chat.findFirst({
            where: {
                userID: toid,
                fromUserId: fromid,
            },
        });
        console.log("Chat already Exits", chat);
        if (chat) {
            //Save message in database
            const Updatedmessage = yield prisma.messages.create({
                data: {
                    id: id,
                    ChatId: chat.id,
                    fromUser: fromid,
                    toUser: toid,
                    message: message,
                },
            });
            res.json({
                Status: true,
                newchat: false,
                message: "Message Saved Successfully",
                chatId: chat.id,
                messageId: Updatedmessage.id,
            });
        }
        else {
            //Create Chat
            const newChat = yield prisma.chat.create({
                data: {
                    userID: toid,
                    fromUserId: fromid,
                },
            });
            const newChat2 = yield prisma.chat.create({
                data: {
                    userID: fromid,
                    fromUserId: toid,
                },
            });
            console.log("Created New Chat", newChat);
            //Save message in database
            const Updatedmessage = yield prisma.messages.create({
                data: {
                    id: id,
                    ChatId: newChat.id,
                    fromUser: fromid,
                    toUser: toid,
                    message: message,
                },
            });
            return res.json({
                Status: true,
                newchat: true,
                message: "Message Saved Successfully",
                chatId: [newChat.id, newChat2.id],
                messageId: Updatedmessage.id,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.json({ Status: false, error: "Internal Server Error" });
    }
}));
router.post("/sendMessagesGroup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, groupid, message } = req.body;
    console.log(req.body);
    let fromid;
    if (!token) {
        return res.status(401).json({ Status: false, error: "No Token Provided" });
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        req.body.user = user;
        fromid = user.id;
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ Status: false, error: "Unauthorized" });
    }
    try {
        //Save message in database
        yield prisma.groupMessages.create({
            data: {
                GroupChatId: groupid,
                fromUser: fromid,
                message: message,
            },
        });
        res.json({
            Status: true,
            message: "Message Saved Successfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.json({ Status: false, error: "Internal Server Error" });
    }
}));
router.get("/getgroupmessages", authentication_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body.user;
    try {
        // Finding the groupIds
        const groups = yield prisma.groupChat.findMany({
            where: {
                users: {
                    some: {
                        id: id,
                    },
                },
            },
        });
        const messages = yield prisma.groupMessages.findMany({
            where: {
                GroupChatId: {
                    in: groups.map((group) => group.id),
                },
            },
        });
        return res.json({ Status: true, messages: messages });
    }
    catch (error) {
        console.log(error);
        return res.json({ Status: false, error: "Internal Server Error" });
    }
}));
router.get("/getmessages", authentication_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body.user;
    try {
        const messages = yield prisma.messages.findMany({
            where: {
                OR: [
                    {
                        fromUser: id,
                    },
                    {
                        toUser: id,
                    },
                ],
            },
        });
        return res.json({ Status: true, messages: messages });
    }
    catch (error) {
        console.log(error);
        return res.json({ Status: false, error: "Internal Server Error" });
    }
}));
router.get("/getchats", authentication_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body.user;
    try {
        const chats = yield prisma.chat.findMany({
            where: {
                fromUserId: id,
            },
        });
        return res.json({ Status: true, chats: chats });
    }
    catch (error) {
        console.log(error);
        return res.json({ Status: false, error: "Internal Server Error" });
    }
}));
router.get("/findchat", authentication_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userid } = req.query;
    const { id } = req.body.user;
    try {
        const chat = yield prisma.chat.findFirst({
            where: {
                userID: id,
            },
        });
        if (!chat) {
            return res.json({ Status: false, error: "Chat Not Found", chat: null });
        }
        res.json({ Status: true, chat: chat.id });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ Status: false, error: "Internal Server Error" });
    }
}));
// Group Messaging Routes
router.post("/creategroup", authentication_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, profile } = req.body;
    const { id } = req.body.user;
    try {
        const group = yield prisma.groupChat.create({
            data: {
                name: name,
                profile: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxlT_-PpQJbt3DsWOZDQYohRy4YF8ck1n8PA&s",
            },
        });
        yield prisma.groupChat.update({
            where: { id: group.id },
            data: {
                users: {
                    connect: { id: id }, // Use this if the user already exists
                },
            },
        });
        res.json({ Status: true, group: group });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ Status: false, error: "Internal Server Error" });
    }
}));
// Adding Multiple or Single Users
router.post("/adduser", authentication_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { groupid, userIds } = req.body;
    console.log;
    try {
        const group = yield prisma.groupChat.update({
            where: { id: groupid },
            data: {
                users: {
                    connect: userIds.map((userId) => ({ id: userId })),
                },
            },
        });
        res.json({ Status: true, group: group });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ Status: false, error: "Internal Server Error" });
    }
}));
// Fetch User's specific Group
router.get("/getgroup", authentication_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body.user;
    try {
        const groups = yield prisma.groupChat.findMany({
            where: {
                users: {
                    some: {
                        id: id,
                    },
                },
            },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        profile: true,
                        GroupChats: true,
                    },
                },
            },
        });
        res.json({ Status: true, groups: groups });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ Status: false, error: "Internal Server Error" });
    }
}));
// Fetch Users based on GroupId
router.post("/getusersgroup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    console.log(id, "Users");
    try {
        const groups = yield prisma.groupChat.findMany({
            where: {
                users: {
                    some: {
                        id: id,
                    },
                },
            },
            include: {
                users: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        profile: true,
                        GroupChats: true,
                    },
                },
            },
        });
        res.json({ Status: true, groups: groups });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ Status: false, error: "Internal Server Error" });
    }
}));
// Endpoint to update the messages status
router.post("/updatemessagestatus", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids, status, token } = req.body;
    let Userid;
    if (!token) {
        return res.status(401).json({ Status: false, error: "No Token Provided" });
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "secret");
        req.body.user = user;
        Userid = user.id;
    }
    catch (error) {
        console.log(error);
        return res.status(401).json({ Status: false, error: "Unauthorized" });
    }
    console.log(ids, status, Userid);
    try {
        // Now update all the Messages with the given Ids
        yield Promise.all(ids.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.messages.update({
                where: { id: id },
                data: { Status: status },
            });
        })));
        res.json({ Status: true, message: "Message Status Updated Successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ Status: false, error: "Internal Server Error" });
    }
}));
module.exports = router;
