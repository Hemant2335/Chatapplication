import express from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
require("dotenv").config();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(400).json({ Status: false, error: "User not found" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ Status: false, error: "Invalid Password" });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "secret");
    console.log("Successfully set cookie");
    res.json({ Status: true, token: token });
    
  } catch (error) {
    console.log(error);
    res.status(400).json({ Status: false, error: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  const { email, username, name, password} = req.body;

  // Check if email already exists
  const user = await prisma.user.findUnique({
    where: {
      email: req.body.email,
    },
  });
  const user2 = await prisma.user.findUnique({
    where: {
      username: req.body.username,
    },
  });
  if (user) {
    return res
      .status(400)
      .json({ Status: false, error: "User already exists" });
  }
    if (user2) {
        return res
        .status(400)
        .json({ Status: false, error: "Username already Taken" });
    }
  // Encrypt password
  const hashedpassword = await bcrypt.hash(password, 10);
  // Create user
  try {
    const newuser = await prisma.user.create({
      data: {
        email: email,
        password: hashedpassword,
        name: name,
        username: username,
      },
    });
    console.log(process.env.JWT_SECRET);
    const token = jwt.sign(
      { id: newuser.id },
      process.env.JWT_SECRET || "secret"
    );
    res.json({ Status: true, token: token });
    
  } catch (error) {
    console.log(error);
    res.status(400).json({ Status: false, error: "Internal Server Error" });
  }
});

module.exports = router;
