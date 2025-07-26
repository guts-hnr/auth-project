import userEvents from "../events/event.js";
import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";
import userShema from "../util/validation.js";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

const dataPath = path.join(process.cwd(), "data", "data.json");

userEvents.on("register", async (req, res) => {
  const { error } = userShema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { username, password } = req.body;

    const data = await fs.readFile(dataPath, "utf-8");
    const users = JSON.parse(data);
    const id = uuid();
    console.log(id);

    const user = users.find((u) => u.username === username);

    if (user) {
      return res.send("You've already registered!\nYou must log in.");
    }

    const hasedPswd = await bcrypt.hash(password, 10);

    users.push({ username, password: hasedPswd });
    await fs.writeFile(dataPath, JSON.stringify(users));

    res.send("You're registered.");
  } catch (error) {
    if (error) throw error;
  }
});

userEvents.on("login", async (req, res) => {
  try {
    const { error } = userShema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { username, password } = req.body;

    const data = await fs.readFile(dataPath, "utf-8");
    const users = JSON.parse(data);

    const user = users.find((u) => u.username === username);

    if (!user) {
      res.send("There is no such username.\nYou must register!");
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
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    const users = JSON.parse(data);

    const newUsers = users.filter((u) => u.username !== req.body.username);
    await fs.writeFile(dataPath, JSON.stringify(newUsers));

    res.send("You've deleted this account.");
  } catch (error) {
    if (error) throw error;
  }
});
