import express from "express";
import userEvents from "../events/event.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", (req, res) => {
  userEvents.emit("register", req, res);
});

router.post("/login", (req, res) => {
  userEvents.emit("login", req, res);
});

router.delete("/user", authenticateToken, (req, res) => {
  userEvents.emit("delete", req, res);
});

export default router;
