import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import userShema from "../util/authValidation.js";
import loginShema from "../util/loginValidation.js";
import deleteShema from "../util/deleteValidation.js";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

const dataPath = path.join(process.cwd(), "data", "data.json");

export const registerHandler = async (req, res) => {
  const { error } = userShema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { username, email, password } = req.body;

    const data = await fs.readFile(dataPath, "utf-8");
    const users = JSON.parse(data);

    const emailExists = users.find((u) => u.email === email);
    const usernameExists = users.find((u) => u.username === username);

    if (emailExists)
      return res.send("You've already registered!\nYou must log in.");

    if (usernameExists)
      return res.send("This username is already taken.\nPlease change it!");

    const hashedPswd = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuid(),
      username,
      email,
      password: hashedPswd,
    };

    users.push(newUser);
    await fs.writeFile(dataPath, JSON.stringify(users));

    res.send("You're registered.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
};

export const login = async (req, res) => {
  const { error } = loginShema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { username, email, password } = req.body;

    const data = await fs.readFile(dataPath, "utf-8");
    const users = JSON.parse(data);

    const user = users.find((u) =>
      email ? u.email === email : u.username === username
    );

    if (!user) {
      return res.status(404).send("Username not founded.");
    }

    const match = await bcrypt.compare(password, user.password);
    console.log(process.env.ACCESS_TOKEN_KEY);

    if (match) {
      const token = jwt.sign(
        { username: user.username },
        process.env.ACCESS_TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.json({ message: "You're logged in.", token });
    } else {
      res.send("You've entered the wrong number!\nPlease try again.");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
};

export const deleteUser = async (req, res) => {
  const { error } = deleteShema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { username } = req.user;

    const data = await fs.readFile(dataPath, "utf-8");
    const users = JSON.parse(data);

    const newUsers = users.filter((user) => user.username !== username);

    if (users.length === newUsers.length) {
      return res.status(404).send("Username not founded!");
    }

    await fs.writeFile(dataPath, JSON.stringify(newUsers, null, 2));
    res.send(`Username ${username} deleted.`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
};
