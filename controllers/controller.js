import userEvents from "../events/event.js";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import userShema from "../util/authValidation.js";
import loginShema from "../util/loginValidation.js";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

const dataPath = path.join(process.cwd(), "data", "data.json");

userEvents.on("register", async (req, res) => {
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
      password,
    };

    users.push(newUser);
    await fs.writeFile(dataPath, JSON.stringify(users, null, 2));

    res.send("You're registered.");
  } catch (error) {
    if (error) throw error;
  }
});

userEvents.on("login", async (req, res) => {
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
      return res.status(404).send("Пользователь не найден");
    }

    const match = await bcrypt.compare(password, user.password);

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
    if (error) throw error;
  }
});

userEvents.on("delete", async (req, res) => {
  const { error } = loginShema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { username } = req.user;

    const data = await fs.readFile(dataPath, "utf-8");
    const users = JSON.parse(data);

    const newUsers = users.filter((user) => user.username === username);

    if (users.length === newUsers.length) {
      return res.status(404).send("Пользователь не найден!");
    }

    await fs.writeFile(dataPath, JSON.stringify(newUsers, null, 2));
    res.send(`Пользователь ${username} удалён.`);
  } catch (error) {
    if (error) throw error;
  }
});
