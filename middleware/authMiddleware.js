import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const authenticateToken = (req, res, next) => {
  const authenHeader = req.headers["authorization"];
  const token = authenHeader && authenHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, user) => {
    if (err) {
      return res.status(403).send("Invalid or expired token.");
    }

    req.user = user;
    next();
  });
};

export default authenticateToken;
