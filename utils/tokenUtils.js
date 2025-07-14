const jwt = require("jsonwebtoken");

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

const generateAccessToken = (payload) => {
  return jwt.sign({ user: payload }, ACCESS_SECRET, { expiresIn: "1h" });
};

const generateRefreshToken = (payload) => {
  return jwt.sign({ user: payload }, REFRESH_SECRET, { expiresIn: "7d" });
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, ACCESS_SECRET);
};

const verifyRefreshToken = (token) => {
  console.log("Verifying refresh token:", token);
  return jwt.verify(token, REFRESH_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
