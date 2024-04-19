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
router.post("/sendmessage", authentication_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { toid, message } = req.body;
    const fromid = req.body.user.id;
    try {
        // Check if Chat already Exists
        const chat = yield prisma.chat.findFirst({
            where: {
                OR: [
                    {
                        userID: fromid,
                        touserID: toid,
                    },
                    {
                        userID: toid,
                        touserID: fromid,
                    },
                ],
            },
        });
        if (chat) {
            //Save message in database
            yield prisma.messages.create({
                data: {
                    ChatId: chat.id,
                    fromUser: fromid,
                    toUser: toid,
                    message: message,
                },
            });
        }
        else {
            //Create Chat
            const newChat = yield prisma.chat.create({
                data: {
                    userID: fromid,
                    touserID: toid,
                },
            });
            //Save message in database
            yield prisma.messages.create({
                data: {
                    ChatId: newChat.id,
                    fromUser: fromid,
                    toUser: toid,
                    message: message,
                },
            });
        }
        return res.json({ Status: true, message: "Message Saved Successfully" });
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
                        fromUser: id
                    },
                    {
                        toUser: id
                    }
                ]
            }
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
                OR: [
                    {
                        userID: id
                    },
                    {
                        touserID: id
                    }
                ]
            }
        });
        return res.json({ Status: true, chats: chats });
    }
    catch (error) {
        console.log(error);
        return res.json({ Status: false, error: "Internal Server Error" });
    }
}));
module.exports = router;
