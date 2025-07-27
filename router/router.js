import express from "express";
import {
  registerHandler,
  login,
  deleteUser,
} from "../controllers/controller.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerHandler);

router.post("/login", login);

router.delete("/user", authenticateToken, deleteUser);

export default router;
