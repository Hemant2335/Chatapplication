import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import authentication from "../middlewares/authentication";

router.post("/sendmessage", authentication, async (req, res) => {
  const { fromid, toid, message } = req.body;

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

module.exports = router;
