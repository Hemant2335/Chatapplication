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
      await prisma.messages.create({
        data: {
          ChatId: chat.id,
          fromUser: fromid,
          toUser: toid,
          message: message,
        },
      });
    } else {
      //Create Chat
      const newChat = await prisma.chat.create({
        data: {
          userID: fromid,
          touserID: toid,
        },
      });
      //Save message in database
      await prisma.messages.create({
        data: {
          ChatId: newChat.id,
          fromUser: fromid,
          toUser: toid,
          message: message,
        },
      });
    }

    return res.json({ Status: true, message: "Message Saved Successfully" });
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
        OR: [
          {
            userID: id,
          },
          {
            touserID: id,
          },
        ],
      },
    });
    return res.json({ Status: true, chats: chats });
  } catch (error) {
    console.log(error);
    return res.json({ Status: false, error: "Internal Server Error" });
  }
});

module.exports = router;
