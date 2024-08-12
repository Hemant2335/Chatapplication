import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import authentication from "../middlewares/authentication";
import jwt from "jsonwebtoken";
require("dotenv").config();

router.post("/sendmessage", async (req, res) => {
  const { token, toid, message } = req.body;
  let fromid;
  if (!token) {
    return res.status(401).json({ Status: false, error: "No Token Provided" });
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.body.user = user;
    fromid = (user as any).id;
  } catch (error) {
    console.log(error);
    return res.status(401).json({ Status: false, error: "Unauthorized" });
  }

  try {
    // Check if Chat already Exists
    const chat = await prisma.chat.findFirst({
      where: {
        userID: toid,
        fromUserId: fromid,
      },
    });
    console.log("Chat already Exits", chat);
    if (chat) {
      //Save message in database
      await prisma.messages.create({
        data: {
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
      });
    } else {
      //Create Chat

      const newChat = await prisma.chat.create({
        data: {
          userID: toid,
          fromUserId: fromid,
        },
      });
      const newChat2 = await prisma.chat.create({
        data: {
          userID: fromid,
          fromUserId: toid,
        },
      });
      console.log("Created New Chat", newChat);
      //Save message in database
      await prisma.messages.create({
        data: {
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
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({ Status: false, error: "Internal Server Error" });
  }
});

router.get("/getmessages", authentication, async (req, res) => {
  const { id } = req.body.user;
  try {
    const messages = await prisma.messages.findMany({
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
  } catch (error) {
    console.log(error);
    return res.json({ Status: false, error: "Internal Server Error" });
  }
});

router.get("/getchats", authentication, async (req, res) => {
  const { id } = req.body.user;
  try {
    const chats = await prisma.chat.findMany({
      where: {
        fromUserId: id,
      },
    });
    return res.json({ Status: true, chats: chats });
  } catch (error) {
    console.log(error);
    return res.json({ Status: false, error: "Internal Server Error" });
  }
});

router.get("/findchat", authentication, async (req, res) => {
  const { userid } = req.query as any;
  const { id } = (req as any).body.user;
  try {
    const chat = await prisma.chat.findFirst({
      where: {
        userID: id,
      },
    });
    if (!chat) {
      return res.json({ Status: false, error: "Chat Not Found", chat: null });
    }
    res.json({ Status: true, chat: chat.id });
  } catch (error) {
    console.log(error);
    res.status(400).json({ Status: false, error: "Internal Server Error" });
  }
});

// Group Messaging Routes

router.post("/creategroup", authentication, async (req, res) => {
  const { name, profile } = req.body;
  try {
    const group = await prisma.groupChat.create({
      data: {
        name: name,
        profile: profile,
      },
    });
    res.json({ Status: true, group: group });
  } catch (error) {
    console.log(error);
    res.status(400).json({ Status: false, error: "Internal Server Error" });
  }
});

// Adding Multiple or Single Users

router.post("/adduser", authentication, async (req, res) => {
  const { groupid, userIds } = req.body;
  try {
    const group = await prisma.groupChat.update({
      where: { id: groupid },
      data: {
        users: {
          connect: userIds.map((userId:string) => ({ id: userId })),
        },
      },
    });
    res.json({ Status: true, group: group });
  } catch (error) {
    console.log(error);
    res.status(400).json({ Status: false, error: "Internal Server Error" });
  }
});

module.exports = router;
